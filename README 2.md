# Ranger Portal

This portal template is populated from `.env.local`

The automation works like this:

1. Google form - https://forms.gle/kFYjiegnsRDNscja6

Submission triggers the code to run in this GAS app

2. Google Apps Script - https://script.google.com/u/3/home/projects/18VXOKc_7bvOCCUoif6LMt5tQj7NLqwdmn75eXVc0YxUsYXQ1u3KjR9SA

Running this script hits `http://143.198.37.25:3000/deploy` with the relevant data

3. Ranger Backend - https://github.com/mito-systems/ranger-backend

Has two endpoints: 

  * `/deploy`, used above, which publishes the relevant AppRecords to the Laconic Registry to trigger an app deployment
  * `/publishRecord`, used by this portal app to publish PhotoRecords to the Laconic Registry: https://github.com/mito-systems/ranger-app/blob/main/src/services/laconicService.ts#L42

## User types

### Portal Creator

Anyone who wants a custom portal can use the Google form and receive an e-mail with a link to share as far and wide as they'd like.

### End users

Receive links to custom portals and are invited to add data by uploading photographs

### Data consumers

Query a data set from any custom portal
