import { FastifyInstance, FastifyServerOptions } from 'fastify';
import { Database } from '../__generated__/supabase-types.js';
import {
  genericCreate,
  genericFetchAll,
  genericFetchById,
  genericUpdate,
  JWT_HEADER,
  JWT_HEADER_SCHEMA_AND_PREHANDLER,
  jwtAuthentication,
} from '../index.js';


export type CompanyPostBody = Database['public']['Tables']['companies']['Insert'];
export type CompanyPutBody = Database['public']['Tables']['companies']['Update'];


export default async function companyRoutes(
  server: FastifyInstance,
  options: FastifyServerOptions,
) {
  server.get('/companies', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      return await genericFetchAll('companies', reply);
    },
  });

  server.get<{ Params: { companyId: string } }>('/companies/:companyId', {
    ...JWT_HEADER_SCHEMA_AND_PREHANDLER,
    handler: async (request, reply) => {
      return await genericFetchById('companies', request.params.companyId, reply);
    },
  });
  server.post<{ Body: CompanyPostBody }>('/companies', {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'company': {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              location: { type: 'string' },
              industry: { type: 'string' },
              num_employees: {
                type: 'string',
                enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10,000', '10,001+'],
              },
            },
          },
        },
        required: ['company'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericCreate<CompanyPostBody>('companies', request.body, reply);
    },
  });

  server.put<{ Body: CompanyPutBody }>('/companies/:companyId', {
    schema: {
      headers: JWT_HEADER,
      body: {
        type: 'object',
        properties: {
          'company': {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              name: { type: 'string' },
              description: { type: 'string' },
              location: { type: 'string' },
              industry: { type: 'string' },
              num_employees: {
                type: 'string',
                enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10,000', '10,001+'],
              },
            },
          },
        },
        required: ['company'],
      },
    },
    preHandler: jwtAuthentication,
    handler: async (request, reply) => {
      return genericUpdate<CompanyPutBody>('companies', request.body, reply);
    },
  });
}
