// lib/queries.ts
export const GET_PROJECTS = `
  query GetProjects {
    projects(first: 50) {
      nodes {
        id
        title
        slug
        projectMeta {
          client
          year
          projectUrl
          featuredColor
          shortDescription
        }
      }
    }
  }
`;
