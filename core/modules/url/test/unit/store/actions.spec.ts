import * as types from '@vue-storefront/core/modules/url/store/mutation-types';
import { cacheStorage } from '@vue-storefront/core/modules/recently-viewed/index';
import { actions as urlActions } from '../../../store/actions';
import { currentStoreView, localizedDispatcherRouteName } from '@vue-storefront/core/lib/multistore';
import { normalizeUrlPath, parametrizeRouteData } from '../../../helpers';

const SearchQuery = {
  applyFilter: jest.fn()
};

jest.mock('@vue-storefront/core/lib/search/searchQuery', () => () =>
  SearchQuery
);
jest.mock('@vue-storefront/i18n', () => ({ t: jest.fn(str => str) }));
jest.mock('@vue-storefront/core/modules/recently-viewed/index', () => ({
  cacheStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  }
}));
jest.mock('@vue-storefront/core/lib/storage-manager', () => ({
  StorageManager: {
    init: jest.fn(),
    get: jest.fn(() => cacheStorage),
    getItem: jest.fn(),
    initCacheStorage: jest.fn()
  }
}));
jest.mock('@vue-storefront/core/lib/multistore', () => ({
  currentStoreView: jest.fn(() => ({
    storeCode: '',
    localizedRoute: jest.fn(),
    appendStoreCode: ''
  })),
  localizedDispatcherRouteName: jest.fn(),
  removeStoreCodeFromRoute: jest.fn(() => '/men/bottoms-men/shorts-men/shorts-19/troy-yoga-short-994.html')
}));
jest.mock('@vue-storefront/core/lib/logger', () => ({
  Logger: {
    log: jest.fn(() => () => {}),
    debug: jest.fn(() => () => {}),
    warn: jest.fn(() => () => {}),
    error: jest.fn(() => () => {}),
    info: jest.fn(() => () => {})
  }
}));
jest.mock('@vue-storefront/core/modules/url/helpers', () => ({
  preProcessDynamicRoutes: jest.fn(),
  parametrizeRouteData: jest.fn(),
  removeStoreCodeFromRoute: jest.fn(),
  normalizeUrlPath: jest.fn()
}));
jest.mock('@vue-storefront/core/lib/storeCodeFromRoute', () =>
  jest.fn(() => '')
);
jest.mock('config', () => ({}));
jest.mock('@vue-storefront/core/app', () => ({
  router: {
    addRoutes: jest.fn()
  }
}));

let url: string;
let routeData: any;

describe('Url actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    url = 'https://www.example.com';
    routeData = 'routeData';
  });

  describe('registerMapping action', () => {
    it('should call register mapping mutation', async () => {
      const contextMock = {
        commit: jest.fn()
      };
      const result = await (urlActions as any).registerMapping(contextMock, {
        url,
        routeData
      });

      expect(contextMock.commit).toHaveBeenCalledWith(types.REGISTER_MAPPING, {
        url,
        routeData
      });
      expect(result).toEqual(routeData);
    });
  });

  describe('registerDynamicRoutes action', () => {
    it('should NOT call registerMapping action if dispatcherMap state is empty', async () => {
      const contextMock = {
        state: {
          dispatcherMap: {}
        },
        dispatch: jest.fn()
      };
      const wrapper = (actions: any) =>
        actions.registerDynamicRoutes(contextMock);

      await wrapper(urlActions);

      expect(contextMock.dispatch).not.toBeCalledWith('registerMapping', {
        url,
        routeData
      });
    });
    it('should call registerMapping action if dispatchetMap is not empty', async () => {
      const contextMock = {
        state: {
          dispatcherMap: {
            url: 'https://www.example.com'
          }
        },
        dispatch: jest.fn()
      };
      routeData = contextMock.state.dispatcherMap.url;
      url = 'url';

      const wrapper = (actions: any) =>
        actions.registerDynamicRoutes(contextMock);

      await wrapper(urlActions);

      expect(contextMock.dispatch).toBeCalledWith('registerMapping', {
        url,
        routeData
      });
    });
  });

  describe('mapUrl action', () => {
    beforeEach(() => {
      (currentStoreView as jest.Mock).mockImplementation(() => ({
        storeCode: ''
      }));
    });

    it('should return resolved promise with parametrizedRoute', () => {
      url = '/men/bottoms-men/shorts-men/shorts-19/troy-yoga-short-994.html';

      (normalizeUrlPath as jest.Mock).mockImplementationOnce(() => url);
      (parametrizeRouteData as jest.Mock).mockImplementationOnce(() => ({
        name: 'configurable-product',
        params: {
          slug: 'troy-yoga-short-994',
          parentSku: 'MSH09',
          childSku: 'MSH09-32-Black'
        }
      }));
      const contextMock = {
        state: {
          dispatcherMap: {
            '/men/bottoms-men/shorts-men/shorts-19/troy-yoga-short-994.html': {
              name: 'configurable-product',
              params: {
                slug: 'troy-yoga-short-994',
                parentSku: 'MSH09',
                childSku: 'MSH09-32-Black'
              }
            }
          }
        }
      };
      const query = { childSku: 'MSH09-32-Black' };
      const expectedResult = new Promise(resolve =>
        resolve({
          name: 'configurable-product',
          params: {
            slug: 'troy-yoga-short-994',
            parentSku: 'MSH09',
            childSku: 'MSH09-32-Black'
          }
        })
      );
      const result = (urlActions as any).mapUrl(contextMock, { url, query });

      expect(result).toEqual(expectedResult);
    });
  });

  describe('mappingFallBack action', () => {
    beforeEach(() => {
      (currentStoreView as jest.Mock).mockImplementation(() => ({
        storeCode: '',
        appendStoreCode: ''
      }));
    });

    it('should return the proper URL from API for products', async () => {
      url = '/men/bottoms-men/shorts-men/shorts-19/troy-yoga-short-994.html';
      (localizedDispatcherRouteName as jest.Mock).mockImplementation(() => url);

      const contextMock = {
        dispatch: jest.fn()
      };
      const params = {
        slug: 'slug',
        sku: 'parentsku2',
        childSku: 'childSku'
      };

      contextMock.dispatch.mockImplementation(() => Promise.resolve({ items: [ { name: 'name1', qty: 2, slug: 'slug1', sku: 'parentsku2' } ] }))

      const result = await (urlActions as any).mappingFallback(contextMock, { url, params });

      expect(result).toEqual({
        name: '/men/bottoms-men/shorts-men/shorts-19/troy-yoga-short-994.html',
        params: {
          slug: 'slug1',
          parentSku: 'parentsku2',
          childSku: 'childSku'
        }
      });
    });

    it('should return return the proper URL from API for category', async () => {
      url = '/men/bottoms-men/shorts-men/shorts-19';
      (localizedDispatcherRouteName as jest.Mock).mockImplementation(() => url);

      const contextMock = {
        dispatch: jest.fn()
      };
      const params = {
        slug: 'shorts-19'
      };

      contextMock.dispatch.mockImplementation(() => Promise.resolve({slug: 'shorts-19'}))

      const result = await (urlActions as any).mappingFallback(contextMock, { url, params });

      expect(result).toEqual({
        name: '/men/bottoms-men/shorts-men/shorts-19',
        params: {
          slug: 'shorts-19'
        }
      });
    })
  });
});
