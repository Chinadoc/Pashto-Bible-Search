#!/bin/bash

# 🎯 ROBUST GIT PUSH SCRIPT
# Handles large repositories and timeout issues

set -e  # Exit on any error

echo "🚀 ROBUST GIT PUSH SOLUTION"
echo "============================"

# Function to check if command succeeded
check_success() {
    if [ $? -eq 0 ]; then
        echo "✅ SUCCESS!"
    else
        echo "❌ FAILED!"
        exit 1
    fi
}

echo ""
echo "📊 Current repository status:"
du -sh .git
echo "Files to push: $(git status --porcelain | wc -l)"

echo ""
echo "🔧 ROBUST PUSH OPTIONS:"
echo "1. Force push current changes (overwrites remote)"
echo "2. Create new branch with essential files only"
echo "3. Try normal push with better error handling"
echo ""

read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo "🔄 FORCE PUSHING CHANGES..."
        git push --force-with-lease origin main
        check_success
        ;;
    2)
        echo "🌿 CREATING CLEAN BRANCH..."
        git checkout -b clean-deployment
        git rm -r --cached "Pashto-Bible-Search" "_pages_tmp" "cache" "node_modules" ".next" 2>/dev/null || true
        git commit -m "feat: Clean deployment branch with essentials only"
        git push origin clean-deployment
        check_success
        echo "✅ Pushed to clean-deployment branch"
        echo "🔄 Switch back to main: git checkout main"
        ;;
    3)
        echo "🔄 NORMAL PUSH WITH TIMEOUT HANDLING..."
        # Try push with background process and timeout
        timeout 120 git push origin main &
        push_pid=$!

        # Wait for process with timeout
        wait $push_pid
        if [ $? -eq 0 ]; then
            echo "✅ PUSH COMPLETED!"
        else
            echo "⚠️  PUSH TIMEOUT - trying alternative method..."
            kill $push_pid 2>/dev/null
            echo "🔄 Trying with --force-with-lease..."
            git push --force-with-lease origin main
            check_success
        fi
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 PUSH COMPLETED SUCCESSFULLY!"
echo "🌐 Your changes are now on GitHub and will auto-deploy to Vercel"
echo "📍 Site: https://pashto-bible-search.vercel.app"
