/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  ButtonGroup,
  Icon,
  InfiniteScrollTable,
} from "@contentstack/venus-components";
import {
  isEmpty,
  arrangeSelectedIds,
  EmptyObjForSearchCase,
  getItemStatusMap,
} from "../../common/utils";
import localeTexts from "../../common/locale/en-us";
import { TypeWarningtext } from "../../common/types";
import { request, search } from "../../services/index";
import "./styles.scss";
import WarningMessage from "../../components/WarningMessage";
import rootConfig from "../../root_config/index";

const SelectorPage: React.FC = function () {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any>({});
  const [selectedData, setSelectedData] = useState<any>({});
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [totalCounts, setTotalCounts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemStatus, setItemStatus] = useState({});
  const [config, setConfig] = useState<any>({});
  const [searchActive, setSearchActive] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState<any>(
    config?.type === "category" ? [] : ["id"]
  );
  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<TypeWarningtext>({
      error: false,
      data: localeTexts.warnings.invalidCredentials,
    });

  const tableRef: any = useRef(null);
  const getSelectedData = async (_type: any, data = []) => {
    if (data?.length) {
      data?.forEach((id: any) => {
        selectedRows[id] = true;
      });
    }
    setSelectedRows({ ...selectedRows });
    setSelectedIds(data);
    return selectedRows;
  };

  const handleMessage = (event: any) => {
    const { data } = event;
    if (data) {
      if (data?.message === "init") {
        getSelectedData(data?.type, data?.selectedItems);
        setConfig({ ...data?.config, type: data?.type });
      }
    }
  };

  useEffect(() => {
    const { opener: windowOpener } = window;
    if (windowOpener) {
      window.addEventListener("message", handleMessage, false);
      windowOpener.postMessage("openedReady", window.location.origin);
      window.addEventListener("beforeunload", () => {
        windowOpener.postMessage({ message: "close" }, window.location.origin);
      });
    }
  }, []);

  const fetchInitialData = async (searchTextParam: any) => {
    try {
      if (!isEmpty(config)) {
        setItemStatus({
          ...getItemStatusMap({}, "loading", 0, Number(config?.page_count)),
        });
        const response = searchTextParam
          ? await search(config, searchTextParam, 1, config?.page_count)
          : await request(config, config?.type, currentPage + 1);
        if (searchText) {
          setSearchActive(true);
          setSearchCurrentPage(1);
        }
        if (!response?.error) {
          setList(response?.data?.items);
          if (config?.type === "category")
            setTotalCounts(response?.data?.items?.length);
          else setTotalCounts(response?.data?.meta?.total);
          const responseDataLength = response?.data?.items?.length;
          setItemStatus({
            ...getItemStatusMap(
              { ...itemStatus },
              "loaded",
              0,
              responseDataLength
            ),
          });
          setLoading(false);
          setCurrentPage(response?.data?.meta?.current_page);
          if (searchText) {
            setSearchCurrentPage(response?.data?.meta?.current_page);
          } else {
            setCurrentPage(response?.data?.meta?.current_page);
          }
        } else {
          setIsInvalidCredentials(response);
        }
      }
    } catch (error) {
      console.error(localeTexts.selectorPage.initialErr, error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchInitialData(searchText);
  }, [config]);

  const fetchData = async (meta: any) => {
    try {
      if (meta?.searchText && !isEmpty(config)) {
        setSearchActive(true);
        setSearchText(meta?.searchText);
        const response = await search(
          config,
          meta?.searchText,
          1,
          config?.page_count
        );
        if (!response?.error) {
          setList(response?.data?.items);
          setLoading(false);
          setTotalCounts(response?.data?.meta?.total);
          setSearchCurrentPage(response?.data?.meta?.current_page);
          const responseDataLength = response?.data?.items?.length;
          setItemStatus({
            ...getItemStatusMap({}, "loaded", 0, responseDataLength),
          });
        } else {
          setIsInvalidCredentials(response);
        }
      } else {
        setSearchActive(false);
        setSearchText("");
        fetchInitialData("");
      }
    } catch (err) {
      console.error(localeTexts.selectorPage.tableFetchError, err);
    }
  };

  const loadMoreItems = async (meta: any) => {
    if (searchActive && !isEmpty(config)) {
      try {
        setItemStatus({
          ...getItemStatusMap(
            { ...itemStatus },
            "loading",
            meta?.startIndex,
            meta?.startIndex ?? 0 + Number(config?.page_count)
          ),
        });
        const response = await request(config, config?.type, currentPage + 1);
        if (!response?.error) {
          setCurrentPage(response?.data?.meta?.current_page);
          setList((prev: any) => [...prev, ...(response?.data?.items || [])]);
          setLoading(false);
          setItemStatus({
            ...getItemStatusMap(
              { ...itemStatus },
              "loaded",
              meta?.startIndex,
              meta?.startIndex ?? 0 + Number(config?.page_count)
            ),
          });
        } else {
          setIsInvalidCredentials(response);
        }
      } catch (err) {
        console.error(localeTexts.selectorPage.loadingError, err);
      }
    } else {
      try {
        setItemStatus({
          ...getItemStatusMap(
            { ...itemStatus },
            "loading",
            meta?.startIndex,
            meta?.startIndex ?? 0 + Number(config?.page_count)
          ),
        });
        const response = await search(
          config,
          meta?.searchText,
          searchCurrentPage + 1,
          config?.page_count
        );
        if (!response?.error) {
          setSearchCurrentPage(response?.data?.meta?.current_page);
          // eslint-disable-next-line no-unsafe-optional-chaining
          setList([...list, ...response?.data?.items]);
          setItemStatus({
            ...getItemStatusMap(
              { ...itemStatus },
              "loaded",
              meta?.startIndex,
              meta?.startIndex ?? 0 + Number(config?.page_count)
            ),
          });
        } else {
          setIsInvalidCredentials(response);
        }
      } catch (err) {
        console.error(localeTexts.selectorPage.errHandling, err);
      }
    }
  };

  const getSelectedRow = (singleSelectedRowIds: any, selected: any) => {
    const selectedObj: any = [];
    singleSelectedRowIds?.forEach((assetUid: any) => {
      selectedObj[assetUid] = true;
    });
    setSelectedRows({ ...selectedObj });
    setSelectedData(selected);
    setCheckedIds(singleSelectedRowIds);
  };

  useEffect(() => {
    setSelectedIds(arrangeSelectedIds(selectedIds, checkedIds));
  }, [checkedIds]);

  const returnSelectedData = () => {
    const dummyData = [
      {
        cs_metadata: {
          multi_config_name: "demos-95",
          isconfigdeleted: false,
        },
        id: "4fd58f8c-2216-4b1f-ab3e-cae2abdc1f11",
        version: 34,
        productType: {
          typeId: "product-type",
          id: "c29c5203-64da-4eb7-9320-fd9b441dbf9b",
        },
        name: {
          en: "New Wayfarer Sunglasses",
        },
        description: {
          en: "<p>The classic Wayfarer is a comfortable, fashionable, and durable pair of sunglasses for women and men. The combination of black durable plastic frame with green glass lenses is iconic.</p><p>100% UV PROTECTION: To protect your eyes from harmful UV rays, these Wayfarer sunglasses include glass lenses that are coated with 100% UV protection. The 52 mm x 37.6 mm lenses are durable and polarized. Eliminates glare</p><p>REDUCE EYE STRAIN: Unisex Wayfarer sunglasses feature precision-cut lenses that help reduce eye strain while outdoors. They are great to wear on both hazy and bright days.</p><p>DURABLE ACETATE FRAMES: Our polarized Wayfarer sunglasses are incredibly durable. The frame is made from lightweight yet strong acetate construction. The bridge measures 18 mm, and the arms are 145 mm for an easy, comfortable fit.</p><p>MULTIPLE FRAME AND LENS COLORS: These sunglasses for women and men are designed in multiple frame and lens colors. Find a color combination that fits your personal brand and style.</p>",
        },
        categories: [
          {
            typeId: "category",
            id: "9dd57f99-f5c3-43ec-90ec-a436ad87fc7e",
          },
        ],
        categoryOrderHints: {},
        slug: {
          en: "new-wayfarer-sunglasses",
        },
        metaTitle: {
          en: "",
        },
        metaDescription: {
          en: "",
        },
        masterVariant: {
          id: 1,
          sku: "wayfarer-555",
          prices: [
            {
              id: "37b46fdf-82aa-48ce-82b8-251f94579bc9",
              value: {
                type: "centPrecision",
                currencyCode: "EUR",
                centAmount: 44900,
                fractionDigits: 2,
              },
            },
          ],
          images: [
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/3-kGXmpNNd.png",
              dimensions: {
                w: 505,
                h: 571,
              },
            },
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/1-96kfxBXD.png",
              dimensions: {
                w: 505,
                h: 571,
              },
            },
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/2-FjyV9iIv.png",
              dimensions: {
                w: 505,
                h: 571,
              },
            },
          ],
          attributes: [
            {
              name: "google-taxonomy-id",
              value: 178,
            },
          ],
          assets: [],
        },
        variants: [],
        searchKeywords: {},
        hasStagedChanges: false,
        published: true,
        key: "new-wayfarer-sunglasses",
        createdAt: "2019-03-07T07:42:23.521Z",
        lastModifiedAt: "2021-08-09T10:18:20.365Z",
      },
      {
        id: "00364575-aed1-4c36-a5b2-2fcefb630737",
        version: 36,
        productType: {
          typeId: "product-type",
          id: "c29c5203-64da-4eb7-9320-fd9b441dbf9b",
        },
        name: {
          en: "Ocean 600M Automatic Chronometer Brown Dial Mid-Size Watch",
        },
        description: {
          en: "<p>Silver-tone stainless steel case with a silver-tone stainless steel bracelet. Uni-directional rotating black ceramic bezel. Black dial with luminous silver-tone hands and index hour markers. Arabic numerals mark the 6, 9 and 12 o'clock positions. minute markers around the outer rim. Dial Type: Analog. Luminescent hands and markers. Date display at the 3 o'clock position. Omega Calibre 8520 automatic movement with a 50-hour power reserve. Scratch resistant sapphire crystal. Screw down crown. Transparent case back. Round case shape, case size: 37.5 mm, case thickness: 10 mm. Band width: 18 mm, band length: 8.5 inches. Fold over clasp. Water resistant at 600 meters / 2000 feet. Functions: date, hour, minute, second, chronometer. Additional Info: features a helium escapement valve located on the edge of the case at the 10 o'clock position. Luxury watch style. Watch label: Swiss Made. Omega Planet Ocean 600M Automatic Chronometer Black Dial Mid-Size Watch 232.30.38.20.01.001.<br></p>",
        },
        categories: [
          {
            typeId: "category",
            id: "9dd57f99-f5c3-43ec-90ec-a436ad87fc7e",
          },
        ],
        categoryOrderHints: {},
        slug: {
          en: "ocean-600m-automatic-chronometer-brown-dial-mid-size-watch",
        },
        metaTitle: {
          en: "",
        },
        metaDescription: {
          en: "",
        },
        masterVariant: {
          id: 1,
          sku: "00364575-aed1-4c36-a5b2-2",
          prices: [
            {
              id: "9dc2c78d-1836-4d47-87ef-26e19e90f3ba",
              value: {
                type: "centPrecision",
                currencyCode: "USD",
                centAmount: 13500,
                fractionDigits: 2,
              },
            },
          ],
          images: [
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/Ocean+600M+Automatic-rSF4Hz1e.png",
              dimensions: {
                w: 505,
                h: 571,
              },
            },
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/Ocean+600M+Automatic-VvRwMBj4.png",
              dimensions: {
                w: 505,
                h: 571,
              },
            },
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/Ocean+600M+Automatic-eLktfI3s.png",
              dimensions: {
                w: 505,
                h: 571,
              },
            },
          ],
          attributes: [
            {
              name: "google-taxonomy-id",
              value: 201,
            },
          ],
          assets: [],
          availability: {
            isOnStock: false,
            availableQuantity: 0,
            version: 5,
            id: "92e77064-3a9a-4d9b-a2a0-82efd6bffffc",
          },
        },
        cs_metadata: {
          multi_config_name: "demos-95",
          isconfigdeleted: false,
        },
        variants: [],
        searchKeywords: {},
        hasStagedChanges: false,
        published: true,
        key: "ocean-600m-automatic-chronometer-brown-dial-mid-size-watch",
        priceMode: "Embedded",
        createdAt: "2019-03-07T06:58:32.577Z",
        lastModifiedAt: "2024-03-28T07:50:59.768Z",
      },
      {
        id: "d025ac2b-f96e-401f-ba2a-fc127877486c",
        version: 66,
        productType: {
          typeId: "product-type",
          id: "c29c5203-64da-4eb7-9320-fd9b441dbf9b",
        },
        cs_metadata: {
          multi_config_name: "demos-95",
          isconfigdeleted: false,
        },
        name: {
          en: "Oppenheimer's Lux Jacket - Blue",
        },
        description: {
          en: '<p>Size Info</p><p>Narrow through the bust and shoulders.</p><p>If purchasing for the first time, order one size up.</p><p>XS=2-4, S=4-6, M=8-10, L=10-12, XL=14.</p><p>Details &amp; Care</p><p>Iconic checks line the collar and cuffs of this lightweight quilted jacket that embraces heritage styling while providing the perfect amount of warmth for transitional seasons.</p><p><br></p><p><br></p><p>25 1/2" length (size Medium)</p><p>Front button closure</p><p>Point collar with hook-and-eye closure</p><p>Long sleeves with button cuffs</p><p>Front slip pockets</p><p>Epaulets</p><p>Lined</p><p>100% polyester</p><p>Dry clean</p><p>Imported</p><p>Collectors</p><p>Item #5448134</p>',
        },
        categories: [
          {
            typeId: "category",
            id: "3c4e7af6-9ad5-4291-8820-8dd1b039d088",
          },
        ],
        categoryOrderHints: {},
        slug: {
          en: "oppenheimers-lux-jacket-blue",
        },
        metaTitle: {
          en: "",
        },
        metaDescription: {
          en: "",
        },
        masterVariant: {
          id: 1,
          sku: "oppenheimers-lux-jacket-blue",
          prices: [
            {
              id: "c3cba3a1-5473-4f92-a426-efdda8f6fb0d",
              value: {
                type: "centPrecision",
                currencyCode: "EUR",
                centAmount: 84999,
                fractionDigits: 2,
              },
            },
          ],
          images: [
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/3-4lLBytOv.jpg",
              dimensions: {
                w: 505,
                h: 570,
              },
            },
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/1-yJRoHVO-.jpg",
              dimensions: {
                w: 505,
                h: 570,
              },
            },
            {
              url: "https://1b9dc76e1b6cccc0f67f-1f325086b230e4b0fc23817e7cbd4735.ssl.cf1.rackcdn.com/2-4Z31tr7_.jpg",
              dimensions: {
                w: 505,
                h: 570,
              },
            },
          ],
          attributes: [
            {
              name: "google-taxonomy-id",
              value: 5598,
            },
          ],
          assets: [],
          availability: {
            isOnStock: false,
            availableQuantity: 0,
            version: 17,
            id: "e429ebcd-c3fa-47c8-b99f-cd1e45e741c0",
          },
        },
        variants: [],
        searchKeywords: {},
        hasStagedChanges: false,
        published: true,
        key: "oppenheimers-lux-jacket-blue",
        priceMode: "Embedded",
        createdAt: "2019-03-07T07:29:55.402Z",
        lastModifiedAt: "2024-04-03T13:56:18.202Z",
      },
      {
        id: "6ca72bbc-6f6a-4bdc-a1f4-abcfd066cba7",
        version: 4,
        productType: {
          typeId: "product-type",
          id: "18c8a88f-d3bf-4fe9-b8bc-f9b5ce25dc49",
        },
        cs_metadata: {
          multi_config_name: "ecom-project",
          isconfigdeleted: false,
        },
        name: {
          "en-US": "Bruno Chair",
          "en-GB": "Bruno Chair",
          "de-DE": 'Sessel "Bruno"',
        },
        description: {
          "en-GB":
            "A modern linen and wood chair features a simple yet stylish design. The chair has a sleek wooden frame, which is stained in a natural wood finish. The seat and backrest are made of a soft linen fabric that is padded for comfort. The linen fabric is a neutral beige.  The backrest of the chair is slightly angled, providing additional comfort and support for the user. The legs of the chair are slightly tapered and have protective foot pads to prevent damage to flooring.  Overall, this modern linen and wood chair is a versatile and elegant addition to any living room, dining room, or office space.",
          "en-US":
            "A modern linen and wood chair features a simple yet stylish design. The chair has a sleek wooden frame, which is stained in a natural wood finish. The seat and backrest are made of a soft linen fabric that is padded for comfort. The linen fabric is a neutral beige.  The backrest of the chair is slightly angled, providing additional comfort and support for the user. The legs of the chair are slightly tapered and have protective foot pads to prevent damage to flooring.  Overall, this modern linen and wood chair is a versatile and elegant addition to any living room, dining room, or office space.",
          "de-DE":
            "Ein moderner Stuhl aus Leinen und Holz zeichnet sich durch ein einfaches, aber stilvolles Design aus. Der Stuhl hat einen schlanken Holzrahmen, der in einem natürlichen Holzfinish gebeizt ist. Der Sitz und die Rückenlehne bestehen aus einem weichen Leinenstoff, der für Komfort gepolstert ist. Der Leinenstoff ist ein neutrales Beige.  Die Rückenlehne des Stuhls ist leicht angewinkelt, was dem Benutzer zusätzlichen Komfort und Unterstützung bietet. Die Beine des Stuhls sind leicht konisch und haben schützende Fußpolster, um Schäden am Bodenbelag zu vermeiden.  Insgesamt ist dieser moderne Leinen- und Holzstuhl eine vielseitige und elegante Ergänzung für jedes Wohnzimmer, Esszimmer oder Büro.",
        },
        categories: [
          {
            typeId: "category",
            id: "ece1656a-43a5-4535-bd4e-cf254a5d7194",
          },
          {
            typeId: "category",
            id: "8de8c236-bb1d-450b-85dd-34541e95092e",
          },
          {
            typeId: "category",
            id: "370391d8-ad80-4b0a-a221-a42048c6d8f5",
          },
        ],
        categoryOrderHints: {},
        slug: {
          "en-US": "bruno-chair",
          "en-GB": "bruno-chair",
          "de-DE": "bruno-stuhl",
        },
        masterVariant: {
          id: 1,
          sku: "BARM-03",
          prices: [
            {
              id: "1b0256fd-d35e-4170-b895-f8e11ec06062",
              value: {
                type: "centPrecision",
                currencyCode: "EUR",
                centAmount: 7999,
                fractionDigits: 2,
              },
              country: "DE",
              discounted: {
                value: {
                  type: "centPrecision",
                  currencyCode: "EUR",
                  centAmount: 6799,
                  fractionDigits: 2,
                },
                discount: {
                  typeId: "product-discount",
                  id: "0b1c431e-6a77-4e66-a801-f657b5bbfc68",
                },
              },
            },
            {
              id: "52d1a89e-fde7-4168-b28d-cf4848985024",
              value: {
                type: "centPrecision",
                currencyCode: "GBP",
                centAmount: 7999,
                fractionDigits: 2,
              },
              country: "GB",
              discounted: {
                value: {
                  type: "centPrecision",
                  currencyCode: "GBP",
                  centAmount: 6799,
                  fractionDigits: 2,
                },
                discount: {
                  typeId: "product-discount",
                  id: "0b1c431e-6a77-4e66-a801-f657b5bbfc68",
                },
              },
            },
            {
              id: "1cde5130-d4b8-48c8-81ec-c0f0a0e7a84f",
              value: {
                type: "centPrecision",
                currencyCode: "USD",
                centAmount: 7999,
                fractionDigits: 2,
              },
              country: "US",
              discounted: {
                value: {
                  type: "centPrecision",
                  currencyCode: "USD",
                  centAmount: 6799,
                  fractionDigits: 2,
                },
                discount: {
                  typeId: "product-discount",
                  id: "0b1c431e-6a77-4e66-a801-f657b5bbfc68",
                },
              },
            },
          ],
          images: [
            {
              url: "https://storage.googleapis.com/merchant-center-europe/sample-data/goodstore/Bruno_Chair-1.1.jpeg",
              dimensions: {
                w: 6473,
                h: 4315,
              },
            },
          ],
          attributes: [
            {
              name: "productspec",
              value: {
                "en-GB": "- Includes 1 chair",
                "de-DE": "- Beinhaltet 1 Stuhl",
                "en-US": "- Includes 1 chair",
              },
            },
            {
              name: "color",
              value: {
                "en-GB": "#B29880",
                "de-DE": "#B29880",
                "en-US": "#B29880",
              },
            },
            {
              name: "colorlabel",
              value: {
                "en-GB": "Beige",
                "de-DE": "Beige",
                "en-US": "Beige",
              },
            },
            {
              name: "finishlabel",
              value: {
                "en-GB": "Birch",
                "de-DE": "Birke",
                "en-US": "Birch",
              },
            },
            {
              name: "finish",
              value: {
                "en-GB": "#FFC28D",
                "de-DE": "#FFC28D",
                "en-US": "#FFC28D",
              },
            },
            {
              name: "color-filter",
              value: {
                key: "#F5F5DC",
                label: {
                  "de-DE": "Beige",
                  "en-GB": "Beige",
                  "en-US": "Beige",
                },
              },
            },
          ],
          assets: [],
          availability: {
            isOnStock: true,
            availableQuantity: 100,
            version: 1,
            id: "28855911-0ecb-424f-8482-9651e375480e",
          },
        },
        variants: [],
        searchKeywords: {},
        hasStagedChanges: false,
        published: true,
        key: "bruno-chair",
        taxCategory: {
          typeId: "tax-category",
          id: "c4a64860-313a-4608-ada5-af13490e9852",
        },
        createdAt: "2024-06-06T11:06:51.404Z",
        lastModifiedAt: "2024-06-06T11:08:19.781Z",
      },
      {
        id: "8ca5cec2-e06f-49bd-93bb-342b0fbdd3e5",
        version: 3,
        productType: {
          typeId: "product-type",
          id: "18c8a88f-d3bf-4fe9-b8bc-f9b5ce25dc49",
        },
        cs_metadata: {
          multi_config_name: "ecom-project",
          isconfigdeleted: false,
        },
        name: {
          "en-US": "Rustic Bowl",
          "en-GB": "Rustic Bowl",
          "de-DE": "Rustikale Schale",
        },
        description: {
          "en-GB":
            "This square wooden bowl is versatile and can be used for a variety of purposes, from serving salads and snacks to holding fruits and vegetables. It is ideal for casual or rustic dining settings and can add a touch of warmth and natural beauty to any table.  The square wooden bowl is a practical and stylish choice for serving and holding food. Its natural beauty and durability make it a popular choice for many different types of cuisine and dining occasions.",
          "en-US":
            "This square wooden bowl is versatile and can be used for a variety of purposes, from serving salads and snacks to holding fruits and vegetables. It is ideal for casual or rustic dining settings and can add a touch of warmth and natural beauty to any table.  The square wooden bowl is a practical and stylish choice for serving and holding food. Its natural beauty and durability make it a popular choice for many different types of cuisine and dining occasions.",
          "de-DE":
            "Diese quadratische Holzschale bietet vielfältige Einsatzmöglichkeiten - vom Servieren von Salaten und Snacks bis hin zum Aufbewahren von Obst und Gemüse. Sie fügt sich ideal in jede ungezwungene oder rustikale Speiseumgebungen ein und verleiht jedem Tisch einen Hauch von Wärme und natürlicher Schönheit. Die quadratische Holzschale ist eine praktische und stilvolle Wahl zum Servieren und Aufbewahren von Speisen. Ihre natürliche Schönheit und Langlebigkeit bietet verschiedene Einsatzmöglichkeiten in der Küche und als Servierobjekt bei unterschiedlichen Anlässen.",
        },
        categories: [],
        categoryOrderHints: {},
        slug: {
          "en-US": "rustic-bowl",
          "en-GB": "rustic-bowl",
          "de-DE": "rustikale-schale",
        },
        masterVariant: {
          id: 1,
          sku: "RB-01",
          prices: [
            {
              id: "99a8ece8-d8fd-41be-b05a-41ffecd72d8b",
              value: {
                type: "centPrecision",
                currencyCode: "EUR",
                centAmount: 199,
                fractionDigits: 2,
              },
              country: "DE",
            },
            {
              id: "54a39e6b-749f-44eb-8010-23cdbc92593c",
              value: {
                type: "centPrecision",
                currencyCode: "GBP",
                centAmount: 199,
                fractionDigits: 2,
              },
              country: "GB",
            },
            {
              id: "56ca490d-b51a-482b-9cf0-10db72cb45fa",
              value: {
                type: "centPrecision",
                currencyCode: "USD",
                centAmount: 199,
                fractionDigits: 2,
              },
              country: "US",
            },
          ],
          images: [
            {
              url: "https://storage.googleapis.com/merchant-center-europe/sample-data/goodstore/Rustic_Bowl-1.1.jpeg",
              dimensions: {
                w: 5105,
                h: 3280,
              },
            },
          ],
          attributes: [
            {
              name: "productspec",
              value: {
                "en-GB": "- Includes 1 bowl",
                "en-US": "- Includes 1 bowl",
                "de-DE": "- Enthält 1 Schüssel",
              },
            },
          ],
          assets: [],
          availability: {
            channels: {
              "a6a6e27a-98e5-4c81-98a9-7b353ff488e1": {
                isOnStock: true,
                availableQuantity: 100,
                version: 1,
                id: "72d6d23e-b5fc-4fa3-a6ae-0ee5669e0cd9",
              },
            },
          },
        },
        variants: [],
        searchKeywords: {},
        hasStagedChanges: false,
        published: true,
        key: "rustic-bowl",
        taxCategory: {
          typeId: "tax-category",
          id: "c4a64860-313a-4608-ada5-af13490e9852",
        },
        createdAt: "2024-06-06T11:06:51.452Z",
        lastModifiedAt: "2024-06-06T11:08:26.613Z",
      },
    ];
    let organizedProducts: any = {};

    organizedProducts = dummyData?.reduce(
      (
        result: { [x: string]: { id: any[] } },
        product: { id: any; cs_metadata: any }
      ) => {
        const { id, cs_metadata } = product;
        const { multi_config_name } = cs_metadata;

        // Check if multi_config_name already exists in result, if not initialize it
        if (!result[multi_config_name]) {
          result[multi_config_name] = { id: [] };
        }

        // Push the id into the array under multi_config_name
        result[multi_config_name].id.push(id);

        return result;
      },
      {}
    );
    //  console.info("transformedObject",organizedProducts)
    const dataArr = JSON.parse(JSON.stringify(dummyData));
    const dataIds = JSON.parse(JSON.stringify(organizedProducts));
    if (window?.opener) {
      window.opener.postMessage(
        { message: "add", dataArr, dataIds },
        window.location.origin
      );
      window.close();
    }
  };

  const onToggleColumnSelector = (event: any) => {
    let hiddenColumnsTemp: any = [];
    Object.keys(event)?.forEach((key: string) => {
      if (!event[key] && !hiddenColumnsTemp.includes(key))
        hiddenColumnsTemp.push(key);
      if (event[key] && hiddenColumnsTemp.includes(key)) {
        const index = hiddenColumnsTemp.indexOf(key);
        hiddenColumnsTemp = hiddenColumnsTemp.splice(index, 1);
      }
    });
    setHiddenColumns(hiddenColumnsTemp);
  };

  const renderSelectorPage = () => {
    // if (isInvalidCredentials?.error)
    //   return (
    //     <div className="invalid-cred-selector">
    //       <WarningMessage content={isInvalidCredentials?.data} />
    //     </div>
    //   );
    return (
      <>
        <InfiniteScrollTable
          uniqueKey={rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]}
          hiddenColumns={hiddenColumns}
          onToggleColumnSelector={onToggleColumnSelector}
          isRowSelect
          fullRowSelect
          viewSelector
          canRefresh
          canSearch={config?.type !== "category"}
          data={
            list?.length
              ? list.map((listData) => ({
                  ...listData,
                  [rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]]: `${
                    listData[rootConfig.ecommerceEnv.UNIQUE_KEY[config?.type]]
                  }`,
                }))
              : []
          }
          columns={
            config?.type === "category"
              ? rootConfig.categorySelectorColumns(config)
              : rootConfig.getProductSelectorColumns(config)
          }
          loading={loading}
          initialSelectedRowIds={selectedRows}
          getSelectedRow={getSelectedRow}
          itemStatusMap={itemStatus}
          fetchTableData={fetchData}
          totalCounts={totalCounts}
          loadMoreItems={loadMoreItems}
          fixedlistRef={tableRef}
          minBatchSizeToFetch={
            config?.page_count || rootConfig.ecommerceEnv.FETCH_PER_PAGE
          }
          name={
            config.type === "category"
              ? {
                  singular: localeTexts.selectorPage.searchPlaceholder.category,
                  plural: localeTexts.selectorPage.searchPlaceholder.categories,
                }
              : {
                  singular: localeTexts.selectorPage.searchPlaceholder.product,
                  plural: localeTexts.selectorPage.searchPlaceholder.products,
                }
          }
          searchPlaceholder={`${
            localeTexts.selectorPage.searchPlaceholder.caption
          } ${
            config?.type === "category"
              ? localeTexts.selectorPage.searchPlaceholder.categories
              : localeTexts.selectorPage.searchPlaceholder.products
          }`}
          emptyObj={EmptyObjForSearchCase}
          onHoverActionList={[
            {
              label: (
                <div className="Table_hoverActions">
                  <Icon
                    icon="NewTab"
                    data={localeTexts.selectorPage.hoverActions.replace(
                      "$",
                      rootConfig.ecommerceEnv.APP_ENG_NAME
                    )}
                  />
                </div>
              ),
              action: (_e: any, data: any) => {
                window.open(
                  rootConfig.getOpenerLink(data?.id, config, config?.type),
                  "_blank"
                );
              },
            },
          ]}
        />
        <ButtonGroup className="buttonGroup">
          <Button onClick={window.close} buttonType="light">
            {localeTexts.buttonLabels.close}
          </Button>
          <Button onClick={returnSelectedData} buttonType="primary">
            <Icon icon="AddPlus" />
            {localeTexts.selectorPage.add.replace(
              "#",
              selectedIds?.length.toString()
            )}{" "}
            {config?.type === "category"
              ? `${localeTexts.buttonLabels.category}`
              : `${localeTexts.buttonLabels.product}`}
          </Button>
        </ButtonGroup>
      </>
    );
  };

  return (
    <div className="selector-page-wrapper">
      <div className="selector-page-header">
        <div className="avatar">
          <img
            src={rootConfig.ecommerceEnv.SELECTOR_PAGE_LOGO}
            alt={`${rootConfig.ecommerceEnv.APP_ENG_NAME} Logo`}
          />
        </div>
        <div className="header">
          {localeTexts.selectorPage.heading.replace(
            "$",
            rootConfig.ecommerceEnv.APP_ENG_NAME
          )}
        </div>
      </div>
      {renderSelectorPage()}
    </div>
  );
};

export default SelectorPage;
