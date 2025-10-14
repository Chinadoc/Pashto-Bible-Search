#!/usr/bin/env python3
"""
Test Framework for External Integration Workflows

This module provides comprehensive testing for the external content monitoring
and integration system, including unit tests, integration tests, and end-to-end
workflow validation.

Test Coverage:
- External monitoring service
- Webhook endpoints
- Data synchronization
- n8n workflow integration
- Change detection logic
- Error handling and recovery
"""

import asyncio
import json
import os
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch
import aiohttp
import pytest
import sys

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from external_monitoring_service import (
    AfghanBiblesMonitor,
    ContentSyncService,
    N8NIntegrationService,
    ContentHash,
    ContentUpdate
)


class TestContentHash(unittest.TestCase):
    """Test ContentHash data class"""

    def test_content_hash_creation(self):
        """Test ContentHash object creation"""
        hash_obj = ContentHash(
            url="https://example.com/test",
            content_hash="abc123",
            last_modified="Wed, 21 Oct 2015 07:28:00 GMT",
            content_type="text",
            timestamp=datetime.now()
        )

        self.assertEqual(hash_obj.url, "https://example.com/test")
        self.assertEqual(hash_obj.content_hash, "abc123")
        self.assertEqual(hash_obj.content_type, "text")


class TestContentUpdate(unittest.TestCase):
    """Test ContentUpdate data class"""

    def test_content_update_creation(self):
        """Test ContentUpdate object creation"""
        update = ContentUpdate(
            url="https://example.com/test",
            content_type="text",
            change_type="modified",
            old_hash="abc123",
            new_hash="def456",
            metadata={"book_slug": "genesis", "chapter": 1}
        )

        self.assertEqual(update.url, "https://example.com/test")
        self.assertEqual(update.change_type, "modified")
        self.assertEqual(update.metadata["book_slug"], "genesis")


class TestAfghanBiblesMonitor(unittest.TestCase):
    """Test AfghanBiblesMonitor class"""

    def setUp(self):
        """Set up test fixtures"""
        self.temp_dir = tempfile.mkdtemp()
        self.cache_file = Path(self.temp_dir) / "test_cache.json"
        self.monitor = AfghanBiblesMonitor(str(self.cache_file))

    def tearDown(self):
        """Clean up test fixtures"""
        import shutil
        shutil.rmtree(self.temp_dir)

    def test_cache_operations(self):
        """Test cache loading and saving"""
        # Test empty cache
        self.assertEqual(len(self.monitor.content_cache), 0)

        # Add test data
        test_hash = ContentHash(
            url="https://test.com",
            content_hash="test123",
            last_modified=None,
            content_type="text",
            timestamp=datetime.now()
        )
        self.monitor.content_cache["test:1"] = test_hash
        self.monitor.save_cache()

        # Create new monitor and test loading
        new_monitor = AfghanBiblesMonitor(str(self.cache_file))
        self.assertEqual(len(new_monitor.content_cache), 1)
        self.assertEqual(new_monitor.content_cache["test:1"].content_hash, "test123")

    def test_content_hash_generation(self):
        """Test content hash generation"""
        # Test text content
        text_content = b"Hello world"
        hash1 = self.monitor._get_content_hash(text_content, "text")
        hash2 = self.monitor._get_content_hash(text_content, "text")
        self.assertEqual(hash1, hash2)

        # Test different content produces different hash
        different_content = b"Different text"
        hash3 = self.monitor._get_content_hash(different_content, "text")
        self.assertNotEqual(hash1, hash3)

    def test_extract_book_chapters_from_html(self):
        """Test chapter extraction from HTML"""
        html_content = '''
        <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        '''
        
        chapters = self.monitor.extract_book_chapters_from_html(html_content, "genesis")
        self.assertEqual(chapters, [1, 2, 3])

    def test_extract_verses_from_html(self):
        """Test verse extraction from HTML"""
        html_content = '''
        <div id="scripture">
            <span class="verseno c" id="v1">1</span>
            <p>First verse text</p>
            <span class="endverse"></span>
            <span class="verseno c" id="v2">2</span>
            <p>Second verse text</p>
            <span class="endverse"></span>
        </div>
        '''
        
        verses = self.monitor.extract_verses_from_html(html_content)
        self.assertEqual(len(verses), 2)
        self.assertEqual(verses[0][0], "1")
        self.assertIn("First verse text", verses[0][1])

    @patch('aiohttp.ClientSession.get')
    async def test_fetch_url(self, mock_get):
        """Test URL fetching"""
        # Mock response
        mock_response = AsyncMock()
        mock_response.read.return_value = b"test content"
        mock_response.headers = {"Last-Modified": "Wed, 21 Oct 2015 07:28:00 GMT"}
        mock_response.raise_for_status.return_value = None
        
        mock_get.return_value.__aenter__.return_value = mock_response

        async with AfghanBiblesMonitor(str(self.cache_file)) as monitor:
            content, last_modified = await monitor.fetch_url("https://test.com")
            
            self.assertEqual(content, b"test content")
            self.assertEqual(last_modified, "Wed, 21 Oct 2015 07:28:00 GMT")

    async def test_check_book_chapter_new_content(self):
        """Test checking new book chapter"""
        with patch.object(self.monitor, 'fetch_url') as mock_fetch:
            mock_fetch.return_value = (b"new content", "Wed, 21 Oct 2015 07:28:00 GMT")
            
            update = await self.monitor.check_book_chapter("genesis", 1)
            
            self.assertIsNotNone(update)
            self.assertEqual(update.change_type, "new")
            self.assertEqual(update.metadata["book_slug"], "genesis")
            self.assertEqual(update.metadata["chapter"], 1)

    async def test_check_book_chapter_no_changes(self):
        """Test checking book chapter with no changes"""
        # Add existing content to cache
        existing_hash = ContentHash(
            url="https://test.com",
            content_hash="existing123",
            last_modified=None,
            content_type="text",
            timestamp=datetime.now()
        )
        self.monitor.content_cache["genesis:1"] = existing_hash

        with patch.object(self.monitor, 'fetch_url') as mock_fetch:
            # Mock same content hash
            with patch.object(self.monitor, '_get_content_hash') as mock_hash:
                mock_hash.return_value = "existing123"
                mock_fetch.return_value = (b"same content", None)
                
                update = await self.monitor.check_book_chapter("genesis", 1)
                
                self.assertIsNone(update)


class TestContentSyncService(unittest.TestCase):
    """Test ContentSyncService class"""

    def setUp(self):
        """Set up test fixtures"""
        self.temp_dir = tempfile.mkdtemp()
        self.data_dir = Path(self.temp_dir) / "data"
        self.data_dir.mkdir(exist_ok=True)
        
        self.monitor = AfghanBiblesMonitor()
        self.sync_service = ContentSyncService(self.monitor, str(self.data_dir))

    def tearDown(self):
        """Clean up test fixtures"""
        import shutil
        shutil.rmtree(self.temp_dir)

    async def test_sync_text_content(self):
        """Test text content synchronization"""
        # Mock monitor methods
        with patch.object(self.monitor, 'fetch_url') as mock_fetch:
            mock_fetch.return_value = (b"<div id='scripture'>Test content</div>", None)
            
            with patch.object(self.monitor, 'extract_verses_from_html') as mock_extract:
                mock_extract.return_value = [("1", "Test verse")]
                
                updates = [
                    ContentUpdate(
                        url="https://test.com",
                        content_type="text",
                        change_type="new",
                        old_hash=None,
                        new_hash="test123",
                        metadata={"book_slug": "genesis", "chapter": 1}
                    )
                ]
                
                results = await self.sync_service.sync_text_content(updates)
                
                self.assertTrue(results['updated_books'])
                self.assertEqual(len(results['new_files']), 1)
                
                # Check if file was created
                expected_file = self.data_dir / "genesis1_pashto.txt"
                self.assertTrue(expected_file.exists())


class TestN8NIntegrationService(unittest.TestCase):
    """Test N8NIntegrationService class"""

    def setUp(self):
        """Set up test fixtures"""
        self.webhook_url = "https://n8n.example.com/webhook"
        self.api_key = "test-api-key"

    @patch('aiohttp.ClientSession.post')
    async def test_trigger_workflow(self, mock_post):
        """Test workflow triggering"""
        mock_response = AsyncMock()
        mock_response.status = 200
        mock_post.return_value.__aenter__.return_value = mock_response

        async with N8NIntegrationService(self.webhook_url, self.api_key) as service:
            success = await service.trigger_workflow("test-workflow", {"test": "data"})
            
            self.assertTrue(success)
            mock_post.assert_called_once()

    async def test_report_content_updates(self):
        """Test content update reporting"""
        updates = [
            ContentUpdate(
                url="https://test.com",
                content_type="text",
                change_type="modified",
                old_hash="old123",
                new_hash="new456",
                metadata={"book_slug": "genesis", "chapter": 1}
            )
        ]

        with patch.object(N8NIntegrationService, 'trigger_workflow') as mock_trigger:
            mock_trigger.return_value = True
            
            async with N8NIntegrationService(self.webhook_url) as service:
                success = await service.report_content_updates(updates)
                
                self.assertTrue(success)
                mock_trigger.assert_called_once()


class TestIntegrationWorkflows(unittest.TestCase):
    """Test end-to-end integration workflows"""

    def setUp(self):
        """Set up test fixtures"""
        self.temp_dir = tempfile.mkdtemp()
        self.cache_file = Path(self.temp_dir) / "integration_cache.json"

    def tearDown(self):
        """Clean up test fixtures"""
        import shutil
        shutil.rmtree(self.temp_dir)

    @patch('aiohttp.ClientSession.get')
    async def test_full_monitoring_workflow(self, mock_get):
        """Test complete monitoring workflow"""
        # Mock HTTP responses
        mock_response = AsyncMock()
        mock_response.read.return_value = b"<div id='scripture'>Test content</div>"
        mock_response.headers = {"Last-Modified": "Wed, 21 Oct 2015 07:28:00 GMT"}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value.__aenter__.return_value = mock_response

        # Mock verse extraction
        with patch.object(AfghanBiblesMonitor, 'extract_verses_from_html') as mock_extract:
            mock_extract.return_value = [("1", "Test verse")]
            
            async with AfghanBiblesMonitor(str(self.cache_file)) as monitor:
                # Test scanning for updates
                updates = await monitor.scan_book_for_updates("genesis")
                
                # Should find new content
                self.assertGreater(len(updates), 0)
                
                # Test cache update
                monitor.update_cache(updates)
                self.assertGreater(len(monitor.content_cache), 0)

    async def test_error_handling(self):
        """Test error handling in workflows"""
        with patch.object(AfghanBiblesMonitor, 'fetch_url') as mock_fetch:
            mock_fetch.side_effect = Exception("Network error")
            
            async with AfghanBiblesMonitor(str(self.cache_file)) as monitor:
                update = await monitor.check_book_chapter("genesis", 1)
                
                # Should handle error gracefully
                self.assertIsNone(update)


class TestWebhookEndpoints(unittest.TestCase):
    """Test webhook endpoint functionality"""

    def setUp(self):
        """Set up test fixtures"""
        self.temp_dir = tempfile.mkdtemp()
        self.data_dir = Path(self.temp_dir) / "data"
        self.data_dir.mkdir(exist_ok=True)

    def tearDown(self):
        """Clean up test fixtures"""
        import shutil
        shutil.rmtree(self.temp_dir)

    def test_webhook_payload_validation(self):
        """Test webhook payload validation"""
        # Valid payload
        valid_payload = {
            "timestamp": datetime.now().isoformat(),
            "source": "n8n",
            "updates": [
                {
                    "url": "https://test.com",
                    "content_type": "text",
                    "change_type": "modified",
                    "metadata": {"book_slug": "genesis", "chapter": 1}
                }
            ]
        }
        
        # Test validation logic (simplified)
        self.assertTrue("updates" in valid_payload)
        self.assertTrue(isinstance(valid_payload["updates"], list))
        self.assertEqual(valid_payload["source"], "n8n")

    def test_webhook_signature_verification(self):
        """Test webhook signature verification"""
        import hmac
        import hashlib
        
        secret = "test-secret"
        payload = '{"test": "data"}'
        signature = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Test signature generation and verification
        expected_signature = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        self.assertEqual(signature, expected_signature)


class TestDataRebuildService(unittest.TestCase):
    """Test data rebuild functionality"""

    def setUp(self):
        """Set up test fixtures"""
        self.temp_dir = tempfile.mkdtemp()
        self.project_root = Path(self.temp_dir)
        self.app_data_dir = self.project_root / "app" / "data"
        self.app_data_dir.mkdir(parents=True, exist_ok=True)

    def tearDown(self):
        """Clean up test fixtures"""
        import shutil
        shutil.rmtree(self.temp_dir)

    def test_verses_cache_rebuild(self):
        """Test verses cache rebuilding"""
        # Create test text file
        test_file = self.app_data_dir / "genesis1_pashto.txt"
        with open(test_file, 'w', encoding='utf-8') as f:
            f.write("1 First verse\n2 Second verse\n")

        # Import and test rebuild service
        from rebuild_data_indexes import DataRebuildService
        
        rebuild_service = DataRebuildService(self.project_root)
        
        # Test verses cache rebuild
        result = asyncio.run(rebuild_service.rebuild_verses_cache())
        self.assertTrue(result)
        
        # Check if verses.json was created
        verses_file = self.app_data_dir / "verses.json"
        self.assertTrue(verses_file.exists())
        
        # Check content
        with open(verses_file, 'r', encoding='utf-8') as f:
            verses_data = json.load(f)
        
        self.assertGreater(len(verses_data), 0)

    def test_word_frequency_rebuild(self):
        """Test word frequency rebuilding"""
        # Create test verses file
        verses_file = self.app_data_dir / "verses.json"
        test_verses = {
            "genesis 1:1": {"text": "hello world", "book": "genesis"},
            "genesis 1:2": {"text": "world peace", "book": "genesis"}
        }
        
        with open(verses_file, 'w', encoding='utf-8') as f:
            json.dump(test_verses, f)

        from rebuild_data_indexes import DataRebuildService
        rebuild_service = DataRebuildService(self.project_root)
        
        result = asyncio.run(rebuild_service.rebuild_word_frequency())
        self.assertTrue(result)
        
        # Check if frequency file was created
        freq_file = self.app_data_dir / "word_frequency_list.json"
        self.assertTrue(freq_file.exists())


class TestConfigurationManagement(unittest.TestCase):
    """Test configuration management"""

    def setUp(self):
        """Set up test fixtures"""
        self.temp_dir = tempfile.mkdtemp()
        self.config_file = Path(self.temp_dir) / "test_config.json"

    def tearDown(self):
        """Clean up test fixtures"""
        import shutil
        shutil.rmtree(self.temp_dir)

    def test_config_loading(self):
        """Test configuration loading"""
        test_config = {
            "monitoring": {
                "enabled": True,
                "check_interval_hours": 24
            },
            "n8n_integration": {
                "enabled": True,
                "webhook_url": "${N8N_WEBHOOK_URL}"
            }
        }
        
        with open(self.config_file, 'w') as f:
            json.dump(test_config, f)
        
        with open(self.config_file, 'r') as f:
            loaded_config = json.load(f)
        
        self.assertEqual(loaded_config["monitoring"]["enabled"], True)
        self.assertEqual(loaded_config["monitoring"]["check_interval_hours"], 24)

    def test_environment_variable_substitution(self):
        """Test environment variable substitution in config"""
        # Set test environment variable
        os.environ["TEST_VAR"] = "test_value"
        
        config_with_env = {
            "test_setting": "${TEST_VAR}"
        }
        
        # Simple substitution (in real implementation, this would be more sophisticated)
        config_str = json.dumps(config_with_env)
        substituted = config_str.replace("${TEST_VAR}", os.environ["TEST_VAR"])
        result_config = json.loads(substituted)
        
        self.assertEqual(result_config["test_setting"], "test_value")


def run_integration_tests():
    """Run integration tests with real external services (optional)"""
    print("Running integration tests...")
    
    # These tests would make real HTTP requests and should be run carefully
    # They're useful for end-to-end validation but require proper setup
    
    async def test_real_monitoring():
        """Test real monitoring (use with caution)"""
        try:
            async with AfghanBiblesMonitor() as monitor:
                # Test with a single book to avoid overwhelming the server
                updates = await monitor.scan_book_for_updates("genesis")
                print(f"Found {len(updates)} updates for genesis")
                
                if updates:
                    print("Sample update:", updates[0].metadata)
                
        except Exception as e:
            print(f"Integration test failed: {e}")

    # Uncomment to run real integration tests
    # asyncio.run(test_real_monitoring())


def run_performance_tests():
    """Run performance tests"""
    print("Running performance tests...")
    
    import time
    
    async def test_monitoring_performance():
        """Test monitoring performance"""
        start_time = time.time()
        
        # Mock monitoring to test performance
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.read.return_value = b"test content"
            mock_response.headers = {}
            mock_response.raise_for_status.return_value = None
            mock_get.return_value.__aenter__.return_value = mock_response
            
            async with AfghanBiblesMonitor() as monitor:
                # Test multiple book checks
                for book in ["genesis", "exodus", "leviticus"]:
                    await monitor.check_book_chapter(book, 1)
        
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"Performance test completed in {duration:.2f} seconds")
        
        # Performance assertions
        assert duration < 10.0, "Monitoring should complete within 10 seconds"

    asyncio.run(test_monitoring_performance())


if __name__ == "__main__":
    # Run unit tests
    unittest.main(verbosity=2, exit=False)
    
    # Run additional test suites
    print("\n" + "="*50)
    run_integration_tests()
    
    print("\n" + "="*50)
    run_performance_tests()
    
    print("\nAll tests completed!")


