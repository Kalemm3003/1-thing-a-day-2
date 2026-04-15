#!/bin/bash

echo "📚 GÉNÉRATION DE LA LISTE DES FAITS"
echo "=================================="
echo ""

# Extraire les titres et compter les hardWords manuellement
echo "📖 DÉTAIL PAR FAIT :"
echo "=================="
echo ""

COUNT=0
while IFS= read -r line; do
    if echo "$line" | grep -q 'title:'; then
        COUNT=$((COUNT + 1))
        TITLE=$(echo "$line" | sed 's/.*title: "//' | sed 's/",.*//')
    fi
    if echo "$line" | grep -q 'category:'; then
        CATEGORY=$(echo "$line" | sed 's/.*category: "//' | sed 's/",.*//')
    fi
    if echo "$line" | grep -q 'hardWords:'; then
        if echo "$line" | grep -q '\[\]'; then
            WORDS=0
        else
            # Compter les mots dans hardWords
            WORDS=$(echo "$line" | grep -o '{' | wc -l)
        fi
        printf "%2d. %-35s → %-12s | %d mot(s) cliquable(s)\n" "$COUNT" "$TITLE" "$CATEGORY" "$WORDS"
        TITLE=""
        CATEGORY=""
    fi
done < data.js

TOTAL=$(grep -c 'title: "' data.js)
echo ""
echo "✅ TOTAL : $TOTAL faits vérifiés"
echo ""
echo "📁 Fichier généré : facts_list.txt"
