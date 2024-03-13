#!/bin/bash

# Diretório contendo os arquivos a serem convertidos
diretorio="/home/marcelo/public_html/ctrl/"

# Loop sobre todos os arquivos no diretório
for arquivo in "$diretorio"/*; do
    # Verifica se o arquivo é um arquivo regular (não um diretório)
    if [ -f "$arquivo" ]; then
        # Determina o nome do arquivo convertido
        arquivo_utf8="${arquivo%.txt}_utf8.txt"
        
        # Converte o arquivo para UTF-8
        iconv -f ISO-8859-1 -t UTF-8 "$arquivo" > "$arquivo_utf8"
        
        echo "Arquivo convertido: $arquivo_utf8"
    fi
done
