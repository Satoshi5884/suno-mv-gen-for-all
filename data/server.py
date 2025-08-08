#!/usr/bin/env python3
"""
簡易HTTPサーバー
CORSエラーを回避するため、ローカルサーバーを起動してファイルを配信します。

使用方法:
1. このファイルと同じディレクトリでコマンドプロンプトまたはPowerShellを開く
2. python server.py を実行
3. ブラウザで http://localhost:3000 にアクセス
"""

import http.server
import socketserver
import os

PORT = 3000

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("ブラウザで http://localhost:3000 にアクセスしてください")
        print("サーバーを停止するには Ctrl+C を押してください")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nサーバーを停止しました")