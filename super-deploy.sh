#!/bin/bash
PHASE=${1:-1}
echo "Deploying Phase $PHASE..."
declare -A DOMAINS
DOMAINS[beauty]="1"
DOMAINS[info]="1"
DOMAINS[social]="1"
DOMAINS[store]="1"
DOMAINS[wtf]="2"
DOMAINS[live]="2"
DOMAINS[fashion]="2"
DOMAINS[community]="2"
DOMAINS[studio]="3"
DOMAINS[club]="3"
DOMAINS[events]="3"
DOMAINS[world]="4"
for domain in "${!DOMAINS[@]}"; do
  if [ "${DOMAINS[$domain]}" == "$PHASE" ]; then
    echo "Deploying shortkey.$domain..."
    cd apps/$domain
    vercel --prod --name "shortkey-$domain" --yes
    cd ../..
    echo "Done: shortkey.$domain"
  fi
done
echo "Phase $PHASE complete!"
