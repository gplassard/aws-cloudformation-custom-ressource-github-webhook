import boto3
import base64
import json
from botocore.exceptions import ClientError
import cfn_resource
import logging
from urllib.request import urlopen, Request, HTTPError, URLError

handler = cfn_resource.Resource()
codebuild = boto3.client('codebuild')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

@handler.create
@handler.update
def get_credentials(event, context):
    try:
        props = event['ResourceProperties']

        deleteResponse = codebuild.delete_webhook(projectName=props['CodebuildProjectName'])
        logger.info('delete response %s', deleteResponse)

        createResponse = codebuild.create_webhook(projectName=props['CodebuildProjectName'])
        logger.info('create response %s', createResponse)

        webhookUrl = createResponse['webhook']['url']
        payload = json.dumps(props['Payload'])
        token = props['GithubOAuth']
        req = Request(
            webhookUrl, 
            method='PATCH',
            data=payload.encode('utf-8'), 
            headers={   
                'Content-Length': len(payload), 
                'Content-Type': 'application/json', 
                'Authorization': 'token ' + token
            }
        )
        response = urlopen(req)
        logger.info('Github response %s', response)

        return {
            'Status': cfn_resource.SUCCESS,
            'PhysicalResourceId': webhookUrl
        }
    except Exception:
        logger.exception('Unexpected error')
        return {
            'Status': cfn_resource.FAILED,
            'Reason': 'Unexpected error'
        }

@handler.delete
def on_delete(event, context):
    props = event['ResourceProperties']

    try:
        deleteResponse = codebuild.delete_webhook(projectName=props['CodebuildProjectName'])
        logger.info('delete response %s', deleteResponse)
    except codebuild.exceptions.ResourceNotFoundException:
        pass

    return {
        'Status': cfn_resource.SUCCESS
    }
