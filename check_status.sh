#!/bin/bash

echo "🔍 Pashto Bible Search - Status Check"
echo "===================================="
echo ""

# Check if enrichment script is running
if pgrep -f "enrich_dictionary_metadata" > /dev/null; then
    echo "✅ Dictionary enrichment is currently running"
    echo "   Check the terminal window for detailed progress"
else
    echo "⏸️  No enrichment process currently running"
fi

echo ""

# Check recent logs for any errors
echo "📋 Recent Activity:"
echo "-------------------"

# Check for recent log entries (last 10 lines of recent logs)
if [ -f "server.log" ]; then
    echo "📄 Server logs (last 5 lines):"
    tail -5 server.log 2>/dev/null | head -5
    echo ""
fi

# Check git status
echo "🔧 Git Status:"
git status --porcelain | head -5
if [ $? -eq 0 ]; then
    echo "   ✅ Git repository is clean"
else
    echo "   ⚠️  Uncommitted changes present"
fi

echo ""

# Show deployment info
echo "🌐 Deployment:"
echo "   Frontend: https://pashto-bible-search.vercel.app/"
echo "   Status: Check browser console for real-time logs"

echo ""
echo "💡 Tips:"
echo "   • Check browser DevTools > Console for real-time search logs"
echo "   • Use 'tail -f server.log' in another terminal for server logs"
echo "   • Long operations show progress in their respective terminals"

















