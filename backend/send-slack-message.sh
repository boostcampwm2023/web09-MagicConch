#!/bin/bash

SLACK_WEBHOOK_URI=$1
DEPLOYMENT_RESULT=$2
GITHUB_REF=$3
GITHUB_ACTOR=$4
GITHUB_WORKFLOW=$5

COLOR=''

if [ "$DEPLOYMENT_RESULT" == 'Success' ]; then
  COLOR="good"
else
  COLOR="danger"
fi

BRANCH=$(echo "$GITHUB_REF" | sed 's|^refs/heads/||')

SLACK_MESSAGE="{
  \"attachments\": [{
    \"color\": \"$COLOR\",
    \"mrkdwn_in\": [\"text\", \"fields\"],
    \"pretext\": \"타로밀크티의 GitHub Actions에서 보내는 슬랙 알림입니다.\",
    \"title\": \":rocket: Deployment Result - $DEPLOYMENT_RESULT :rocket:\",
    \"fields\": [
      {\"title\": \"Branch\", \"value\": \"$BRANCH\"},
      {\"title\": \"Author\", \"value\": \"$GITHUB_ACTOR\"},
      {\"title\": \"Workflow\", \"value\": \"$GITHUB_WORKFLOW\"}
    ],
    \"author_name\": \"타로밀크티 GitHub Actions\"
  }]
}"

curl -X POST -H 'Content-type: application/json' --data "$SLACK_MESSAGE" "$SLACK_WEBHOOK_URI"
