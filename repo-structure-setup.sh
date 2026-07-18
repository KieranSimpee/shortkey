#!/bin/bash
PHASE1=("beauty" "info" "social" "store")
PHASE2=("wtf" "live" "fashion" "community")
PHASE3=("studio" "club" "events")
PHASE4=("world")
ALL_DOMAINS=("${PHASE1[@]}" "${PHASE2[@]}" "${PHASE3[@]}" "${PHASE4[@]}")
for domain in "${ALL_DOMAINS[@]}"; do
  FOLDER="apps/$domain"
  mkdir -p "$FOLDER/app"
  mkdir -p "$FOLDER/components"
  mkdir -p "$FOLDER/lib"
  mkdir -p "$FOLDER/public"
  echo "✅ Created apps/$domain"
done
echo "Done! Now run: git add . && git commit -m '[SHORTKEY] init monorepo structure' && git push"
