import FacebookPixel from "../../src/integrations/FacebookPixel";

beforeAll(() => { });

afterAll(() => {
  jest.restoreAllMocks();
});

describe("FacebookPixel init tests", () => {
  let facebookPixel;

  test("Testing init call of Facebook Pixel with identified user", () => {
    const mockAnalytics = {
      getUserTraits: jest.fn(() => ({
        firstName: "rudder",
        lastName: "stack",
        email: "abc@rudderstack.com"
      })),
      getAnonymousId: jest.fn(() => "testAnonymousID"),
      getUserId: jest.fn(() => "testUserID")
    };
    facebookPixel = new FacebookPixel({ pixelId: "12567839", useUpdatedMapping: true }, mockAnalytics);
    facebookPixel.init();
    expect(typeof window.fbq).toBe("function");
    expect(facebookPixel.userPayload).toStrictEqual({
      external_id: 'd06773e1bf4b8a96a4786fbb8e3444092438ad29401769613ae9e0e3e1e08a84',
      em: 'abc@rudderstack.com',
      ph: undefined,
      ge: undefined,
      db: undefined,
      ln: 'stack',
      fn: 'rudder'
    });
  });

  test("Testing init call of Facebook Pixel with anonymous user", () => {
    const mockAnalytics = {
      getUserTraits: jest.fn(() => null),
      getAnonymousId: jest.fn(() => "testAnonymousID"),
      getUserId: jest.fn(() => null)
    };
    facebookPixel = new FacebookPixel({ pixelId: "12567839", useUpdatedMapping: true }, mockAnalytics);
    facebookPixel.init();
    expect(typeof window.fbq).toBe("function");
    expect(facebookPixel.userPayload).toStrictEqual({
      external_id: 'd4e669b42293a60cc65b22830a922824e6e9c7736c6058fbbb3de780d2f4a17f',
      em: undefined,
      ph: undefined,
      ge: undefined,
      db: undefined
    }
    );
  });
});

describe("FacebookPixel page", () => {
  const mockAnalytics = {
    getUserTraits: jest.fn(() => ({
      firstName: "rudder",
      lastName: "stack",
      email: "abc@rudderstack.com"
    })),
    getAnonymousId: jest.fn(() => "testAnonymousID"),
    getUserId: jest.fn(() => "testUserID")
  };
  let facebookPixel;
  beforeEach(() => {
    facebookPixel = new FacebookPixel({ pixelId: "12567839", useUpdatedMapping: true }, mockAnalytics);
    facebookPixel.init();
    window.fbq = jest.fn();
  });

  test("send pageview", () => {
    facebookPixel.page({
      message: {
        context: {},
        properties: {
          category: "test cat",
          path: "/test",
          url: "http://localhost",
          referrer: "",
          title: "test page",
          testDimension: "abc"
        },
      },
    });
     // console.log(JSON.stringify(window.fbq.mock.calls)); // this has set with empty {} object when resetCustomDimensions
     expect(window.fbq.mock.calls[0][0]).toEqual("track");
     expect(window.fbq.mock.calls[0][1]).toEqual("PageView")
     expect(window.fbq.mock.calls[0][2]).toEqual({
      "category": "test cat",
      "path": "/test",
      "url": "http://localhost",
      "referrer": "",
      "title": "test page",
      "testDimension": "abc"
    });
  });
});

describe("Facebook Pixel Track event", () => {
  const mockAnalytics = {
    getUserTraits: jest.fn(() => ({
      firstName: "rudder",
      lastName: "stack",
      email: "abc@rudderstack.com"
    })),
    getAnonymousId: jest.fn(() => "testAnonymousID"),
    getUserId: jest.fn(() => "testUserID")
  };
  let facebookPixel;
  beforeEach(() => {
    facebookPixel = new FacebookPixel({ pixelId: "12567839", useUpdatedMapping: true }, mockAnalytics);
    facebookPixel.init();
    window.fbq = jest.fn();
  });

  test("Testing Ecommerce Track Events", () => {
    facebookPixel.track({
      message: {
        context: {},
        event: "Order Completed",
        properties: {
          "customProp": "testProp",
          checkout_id: 'what is checkout id here??',
          event_id: 'purchaseId',
          order_id: "transactionId",
          value: 35.00,
          shipping: 4.00,
          coupon: 'APPARELSALE',
          currency: 'GBP',
          products: [
              {
                "customPropProd": "testPropProd",
                product_id: 'abc',
                  category: 'Merch',
                  name: 'Food/Drink',
                  brand: '',
                  variant: 'Extra topped',
                  price: 3.00,
                  quantity: 2,
                  currency: 'GBP',
                  position: 1,
                  value: 6.00,
                  typeOfProduct: 'Food',
                  url: 'https://www.example.com/product/bacon-jam',
                  image_url: 'https://www.example.com/product/bacon-jam.jpg'
              }
           ]
      },
    }
    });
    expect(window.fbq.mock.calls[0][0]).toEqual("trackSingle");
    expect(window.fbq.mock.calls[0][1]).toEqual("12567839");
    expect(window.fbq.mock.calls[0][2]).toEqual("Purchase");
    expect(window.fbq.mock.calls[0][3]).toEqual({
      "content_ids": [
        "abc"
      ],
      "content_type": [
        "product"
      ],
      "currency": "GBP",
      "value": 0,
      "contents": [
        {
          "id": "abc",
          "quantity": 2,
          "item_price": 3
        }
      ],
      "num_items": 1
    });
    expect(window.fbq.mock.calls[0][4]).toEqual({
      "eventID": "purchaseId"
    });

  });

  test("Testing Track Custom Events", () => {
    facebookPixel.track({
      message: {
        context: {},
        event: "Custom",
        properties: {
          "customProp": "testProp",
          checkout_id: 'what is checkout id here??',
          event_id: 'purchaseId',
          order_id: "transactionId",
          value: 35.00,
          shipping: 4.00,
          coupon: 'APPARELSALE',
          currency: 'GBP',
          products: [
              {
                "customPropProd": "testPropProd",
                product_id: 'abc',
                  category: 'Merch',
                  name: 'Food/Drink',
                  brand: '',
                  variant: 'Extra topped',
                  price: 3.00,
                  quantity: 2,
                  currency: 'GBP',
                  position: 1,
                  value: 6.00,
                  typeOfProduct: 'Food',
                  url: 'https://www.example.com/product/bacon-jam',
                  image_url: 'https://www.example.com/product/bacon-jam.jpg'
              }
           ]
      },
    }
    });
    console.log(JSON.stringify(window.fbq.mock.calls));
    expect(window.fbq.mock.calls[0][0]).toEqual("trackSingleCustom");
    expect(window.fbq.mock.calls[0][1]).toEqual("12567839");
    expect(window.fbq.mock.calls[0][2]).toEqual("Custom");
    expect(window.fbq.mock.calls[0][3]).toEqual( {
      "customProp": "testProp",
      "checkout_id": "what is checkout id here??",
      "event_id": "purchaseId",
      "order_id": "transactionId",
      "value": 0,
      "shipping": 4,
      "coupon": "APPARELSALE",
      "currency": "GBP",
      "products": [
        {
          "customPropProd": "testPropProd",
          "product_id": "abc",
          "category": "Merch",
          "name": "Food/Drink",
          "brand": "",
          "variant": "Extra topped",
          "price": 3,
          "quantity": 2,
          "currency": "GBP",
          "position": 1,
          "value": 6,
          "typeOfProduct": "Food",
          "url": "https://www.example.com/product/bacon-jam",
          "image_url": "https://www.example.com/product/bacon-jam.jpg"
        }
      ]
    });
    expect(window.fbq.mock.calls[0][4]).toEqual({
      "eventID": "purchaseId"
    });

  });
});



