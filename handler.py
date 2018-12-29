import boto3
import base64
import json
from botocore.exceptions import ClientError
import cfn_resource

handler = cfn_resource.Resource()

@handler.create
@handler.update
def get_credentials(event, context):
    try:
        return {
            'Status': cfn_resource.SUCCESS,
            'PhysicalResourceId': event['LogicalResourceId']
        }
    except Exception:
        return {
            'Status': cfn_resource.FAILED,
            'Reason': 'Unexpected error'
        }

@handler.delete
def on_delete(event, context):
    return {
        'Status': cfn_resource.SUCCESS
    }
