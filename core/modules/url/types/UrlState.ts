import { Route } from 'vue-router';
import { LocalizedRoute } from '@vue-storefront/core/lib/types'

// This object should represent structure of your modules Vuex state
// It's a good practice is to name this interface accordingly to the KET (for example mailchimpState)
export interface UrlState {
  dispatcherMap: { [path: string]: LocalizedRoute},
  currentRoute: Partial<Route>,
  prevRoute: Partial<Route>,
  isBackRoute: boolean
}
