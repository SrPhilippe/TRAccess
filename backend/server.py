import http.server
import socketserver
import json
import sys

def get_bit(val, n):
    """Retorna o n-ésimo bit de um valor."""
    return (val >> n) & 1

def calculate_triaxx_password(hex_code_str, day, month):
    """Calcula a senha Triaxx baseada no hex code e data."""
    try:
        # Limpeza básica da string (remove espaços extras)
        hex_code_str = hex_code_str.strip()
        
        # 1. Parse do Código HEX
        parts = [int(x, 16) for x in hex_code_str.split('-')]
        
        # Verificação de segurança para garantir que o código tem tamanho suficiente
        if len(parts) < 9:
            return {"Erro": "Código Hex incompleto. O formato deve ter pelo menos 9 bytes separados por traço."}

        # Bytes Relevantes
        b1 = parts[1]   # Desafio Low
        b3 = parts[3]   # Desafio High
        b5 = parts[5]   # MAC Byte 0
        b6 = parts[6]   # MAC Byte 1
        b7 = parts[7]   # MAC Byte 2
        b8 = parts[8]   # MAC Byte 3
        
        # 2. Fórmula Universal para F1 e F2 (Engenharia Reversa GF2)
        
        # Cálculo dos bits de F1
        f1_bits = [0] * 8
        f1_bits[0] = get_bit(b5,1)^get_bit(b5,3)^get_bit(b5,5)^get_bit(b5,6)^get_bit(b6,0)^get_bit(b6,1)^get_bit(b7,0)
        f1_bits[1] = get_bit(b5,0)^get_bit(b5,1)^get_bit(b5,3)^get_bit(b5,7)^get_bit(b6,2)^get_bit(b6,3)
        f1_bits[2] = get_bit(b5,2)^get_bit(b5,3)^get_bit(b5,6)^get_bit(b5,7)^get_bit(b6,0)^get_bit(b6,3)^get_bit(b6,6)^get_bit(b8,1)
        f1_bits[3] = get_bit(b5,0)^get_bit(b5,2)^get_bit(b5,3)^get_bit(b5,4)^get_bit(b5,6)^get_bit(b6,2)^get_bit(b8,1)
        f1_bits[4] = get_bit(b5,0)^get_bit(b5,1)^get_bit(b5,2)^get_bit(b5,4)^get_bit(b5,6)^get_bit(b6,3)^get_bit(b6,6)^get_bit(b7,0)
        f1_bits[5] = get_bit(b5,0)^get_bit(b5,1)^get_bit(b5,2)^get_bit(b6,1)^get_bit(b6,6)^get_bit(b7,0)^get_bit(b8,1)
        f1_bits[6] = get_bit(b5,0)^get_bit(b5,3)^get_bit(b5,4)^get_bit(b6,0)^get_bit(b6,1)^get_bit(b6,2)^get_bit(b6,6)^get_bit(b7,0)
        f1_bits[7] = get_bit(b5,0)^get_bit(b5,1)^get_bit(b5,5)^get_bit(b6,0)^get_bit(b6,1)^get_bit(b6,6)^get_bit(b8,1)
        
        # Reconstruir Byte F1
        F1 = 0
        for i in range(8): F1 |= (f1_bits[i] << i)

        # Cálculo dos bits de F2
        f2_bits = [0] * 8
        f2_bits[0] = get_bit(b5,2)^get_bit(b5,4)^get_bit(b5,6)^get_bit(b5,7)^get_bit(b6,0)^get_bit(b6,1)^get_bit(b7,0)^get_bit(b8,1)
        f2_bits[1] = get_bit(b5,0)^get_bit(b5,1)^get_bit(b5,2)^get_bit(b5,5)^get_bit(b6,0)^get_bit(b6,1)^get_bit(b6,2)^get_bit(b6,3)^get_bit(b8,1)
        f2_bits[2] = get_bit(b5,1)^get_bit(b5,3)^get_bit(b5,5)^get_bit(b5,6)^get_bit(b6,0)^get_bit(b6,3)^get_bit(b6,6)^get_bit(b8,1)
        f2_bits[3] = get_bit(b5,0)^get_bit(b5,3)^get_bit(b5,6)^get_bit(b6,1)^get_bit(b6,2)^get_bit(b6,6)^get_bit(b8,1)
        f2_bits[4] = get_bit(b5,0)^get_bit(b5,1)^get_bit(b5,6)^get_bit(b6,0)^get_bit(b6,3)^get_bit(b6,6)^get_bit(b8,1)
        f2_bits[5] = get_bit(b5,1)^get_bit(b5,2)^get_bit(b5,4)^get_bit(b6,0)^get_bit(b6,1)^get_bit(b6,3)^get_bit(b6,6)^get_bit(b8,1)
        f2_bits[6] = get_bit(b5,0)^get_bit(b5,1)^get_bit(b5,2)^get_bit(b5,3)^get_bit(b5,4)^get_bit(b5,7)^get_bit(b6,1)^get_bit(b6,3)^get_bit(b6,6)
        f2_bits[7] = get_bit(b5,0)^get_bit(b5,5)^get_bit(b5,7)
        
        # Reconstruir Byte F2
        F2 = 0
        for i in range(8): F2 |= (f2_bits[i] << i)

        # 3. Cálculo do TRIAXX (Temporal)
        triaxx_val = (169 * day) - (13 * month) + 351
        t_high = triaxx_val // 256
        t_low = triaxx_val % 256
        
        # 4. Cálculo das Chaves Finais (K)
        k3 = t_high ^ F1
        k1 = t_low ^ F2
        
        # 5. Decodificação da Senha
        pass_high = b3 ^ k3
        pass_low = b1 ^ k1
        
        final_password = (pass_high * 256) + pass_low
        
        return {
            "F1_Calculado": F1,
            "F2_Calculado": F2,
            "Senha": final_password
        }
    except ValueError:
        return {"Erro": "Formato inválido. Certifique-se de usar HEX com traços (XX-XX-...) e números inteiros para data."}
    except Exception as e:
        return {"Erro": str(e)}

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/generate':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data)
                
                hex_code = data.get('hex')
                day = data.get('day')
                month = data.get('month')
                
                print(f"Received request: Hex={hex_code}, Date={day}/{month}")
                
                result = calculate_triaxx_password(hex_code, day, month)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
            except Exception as e:
                self.send_error(500, str(e))
        else:
            self.send_error(404)

PORT = 8000
with socketserver.TCPServer(("", PORT), RequestHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
