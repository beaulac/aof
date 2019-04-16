#!/usr/bin/env bash
set -euxo pipefail;

# Make sure we are in the script's directory:
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd ${DIR};

OUT="dist"

mkdir -p "$OUT";

SITE_ID="8eaf5d64-af09-4687-9fbf-e390e1af4e17"
REPO_URL="https://aof-repo.bdtem.co.in"

cat << END_TEXT > ${OUT}/_redirects
# GET SAMPLES LIST:
/samples    ${REPO_URL}/samples.txt 200

# GET INDIVIDUAL SAMPLE:
/samples/*  ${REPO_URL}/:splat  200
END_TEXT

netlify deploy -a"$(cat _token)" -d"${OUT}" -s"${SITE_ID}" -p
