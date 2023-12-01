import { fetchWordpress } from "./fetchWordpress";

export interface InterfaceGetRelationshipData {
  /** The URL of the WordPress API */
  api_url: string;
  /** The GraphQL query string for fetching data */
  query: string;
  /** An array of string IDs representing the items to fetch data for */
  allIds: string[];
  /** Example 'contentnode.acfForm', etc */
  getData: string[];
  /** (Optional) An authentication token for accessing protected endpoints */
  token?: string;
}

export const getRelationshipData = async ({ api_url, query, allIds, getData, token }: InterfaceGetRelationshipData) => {
  const allPages = await Promise.all(
    allIds.map(async (id) => {
      const data = await fetchWordpress({ api_url, query, variables: { id }, token: token || undefined });
      return data;
    }),
  );

  const filteredData = allPages.map((page) => {
    const filteredObject = getData.reduce((acc, fieldPath) => {
      const fieldParts = fieldPath.split('.');
      const value = fieldParts.reduce((a, i) => (a && a[i] !== undefined ? a[i] : undefined), page);
      return { ...acc, [fieldParts[fieldParts.length - 1]]: value };
    }, {});

    return filteredObject;
  });

  return filteredData;
};
