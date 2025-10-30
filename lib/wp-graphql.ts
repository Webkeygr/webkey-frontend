// lib/wp-graphql.ts
const WP_GRAPHQL_ENDPOINT =
  process.env.WP_GRAPHQL_ENDPOINT || "https://cms.webkey.gr/graphql";

export async function fetchWPGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await fetch(WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    // αυτό λέει στο Next: κάνε το revalidate ανά 60"
    next: { revalidate: 60 },
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    console.error("WPGraphQL error:", json.errors || res.statusText);
    throw new Error("Failed to fetch from WPGraphQL");
  }

  return json.data;
}
