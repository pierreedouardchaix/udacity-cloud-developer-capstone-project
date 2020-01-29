// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ww8o0ie1xa'
const region = 'eu-west-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-ei58tyvf.eu.auth0.com',            // Auth0 domain
  clientId: '0W2OU8mP11RLWdwYHHx2EQw8y2xsgTMp',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
