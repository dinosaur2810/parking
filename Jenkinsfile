pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from repository..."
                    checkout scm
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "🔨 Building project artifacts..."
                    // For a static site, we just verify all essential files exist
                    powershell '''
                        $requiredFiles = @(
                            "index.html",
                            "dashboard.html",
                            "park-in.html",
                            "park-out.html",
                            "parking-slots.html",
                            "settings.html",
                            "transactions.html",
                            "style.css",
                            "dashboard.css",
                            "park-in.css",
                            "park-out.css",
                            "parking-slots.css",
                            "settings.css",
                            "transactions.css",
                            "script.js",
                            "dashboard.js",
                            "park-in.js",
                            "park-out.js",
                            "parking-slots.js",
                            "settings.js",
                            "transactions.js"
                        )
                        
                        Write-Host "✅ Verifying required files..."
                        $missing = @()
                        foreach ($file in $requiredFiles) {
                            if (Test-Path $file) {
                                Write-Host "  ✓ $file"
                            } else {
                                $missing += $file
                                Write-Host "  ✗ MISSING: $file"
                            }
                        }
                        
                        if ($missing.Count -gt 0) {
                            throw "Missing files: $($missing -join ', ')"
                        }
                        Write-Host "✅ All required files present!"
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo "🧪 Running validation tests..."
                    powershell '''
                        Write-Host "✅ HTML Syntax Validation"
                        Write-Host "  - Checking HTML files for common issues..."
                        
                        $htmlFiles = Get-ChildItem -Filter "*.html"
                        foreach ($file in $htmlFiles) {
                            $content = Get-Content $file.FullName -Raw
                            
                            # Basic checks
                            if ($content -notmatch "<html|<!DOCTYPE") {
                                Write-Host "  ⚠ Warning: $($file.Name) might be missing HTML structure"
                            }
                            
                            if ($content -notmatch "</html>") {
                                Write-Host "  ⚠ Warning: $($file.Name) might be missing closing HTML tag"
                            }
                        }
                        
                        Write-Host "✅ Validation complete"
                    '''
                }
            }
        }

        stage('Package') {
            steps {
                script {
                    echo "📦 Packaging application..."
                    powershell '''
                        $buildDir = "build"
                        if (Test-Path $buildDir) {
                            Remove-Item -Recurse -Force $buildDir
                        }
                        
                        New-Item -ItemType Directory -Path $buildDir | Out-Null
                        
                        # Copy HTML files
                        Copy-Item -Filter "*.html" -Destination $buildDir -Recurse
                        
                        # Copy CSS files
                        Copy-Item -Filter "*.css" -Destination $buildDir -Recurse
                        
                        # Copy JS files
                        Copy-Item -Filter "*.js" -Destination $buildDir -Recurse
                        
                        # Copy README and documentation
                        Copy-Item -Filter "*.md" -Destination $buildDir -Recurse
                        Copy-Item -Filter "*.txt" -Destination $buildDir -Recurse
                        
                        Write-Host "✅ Build package created in 'build' directory"
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "🚀 Deploying application..."
                    powershell '''
                        $deployPath = "C:\\xampp\\htdocs\\Parkingfinal"
                        Write-Host "Deploying to: $deployPath"
                        
                        # Copy build files to deployment directory
                        Copy-Item -Path "build\\*" -Destination $deployPath -Recurse -Force
                        
                        Write-Host "✅ Deployment complete"
                        Write-Host "🌐 Application available at: http://localhost/Parkingfinal/"
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo "📊 Cleaning up workspace..."
                powershell '''
                    if (Test-Path "build") {
                        Remove-Item -Recurse -Force "build"
                    }
                '''
            }
        }

        success {
            script {
                echo "✅ Pipeline completed successfully!"
            }
        }

        failure {
            script {
                echo "❌ Pipeline failed. Check logs above for details."
            }
        }
    }
}
