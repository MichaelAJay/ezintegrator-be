import { JSONSchemaType } from 'ajv';
import { validateWithAjv } from '../../../../../utility';
import { ajv } from '../../../../../utility/singletons';
import { IGetApiForUsernameNutshellResponse } from '../../interfaces/nutshell-responses';

const getApiForUsernameNutshellApiResponseSchema: JSONSchemaType<IGetApiForUsernameNutshellResponse> =
  {
    type: 'object',
    properties: {
      result: {
        type: 'object',
        properties: {
          api: { type: 'string' },
        },
        required: ['api'],
        additionalProperties: true,
      },
    },
    required: ['result'],
    additionalProperties: true,
  };

const getApiForUsernameNutshellApiResponseValidationFunction = ajv.compile(
  getApiForUsernameNutshellApiResponseSchema,
);

export function validateGetApiForUsernameNutshellResponse(
  data: unknown,
): data is IGetApiForUsernameNutshellResponse {
  return validateWithAjv<IGetApiForUsernameNutshellResponse>(
    data,
    'IGetApiForUsernameNutshellResponse',
    getApiForUsernameNutshellApiResponseValidationFunction,
  );
}
