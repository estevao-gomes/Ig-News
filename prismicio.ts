import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'
import sm from './sm.json'

export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

type createClientProps = {
    previewData?: any,
    options?: prismic.ClientConfig,
    req: prismic.HttpRequestLike

}

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc) {
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'page':
      return `/posts/${doc.uid}`
    default:
      return null
  }
}

// This factory function allows smooth preview setup
export function createClient(config={} as createClientProps) {
  const client = prismic.createClient(endpoint, config.options)

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client
}