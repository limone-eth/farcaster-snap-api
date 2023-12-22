export const FarcasterFollowsInCommonQuery = `
query MyQuery($identityA: Identity!, $identityB: Identity!, $cursor: String) {
    SocialFollowers(
      input: {blockchain: ALL, limit: 200, filter: {identity: {_eq: $identityA}, dappName: {_eq: farcaster}}, cursor: $cursor}
    ) {
      Follower {
        followerAddress {
          socialFollowings(
            input: {filter: {identity: {_eq: $identityB}, dappName: {_eq: farcaster}}, limit: 200, order: {followingSince: ASC}}
          ) {
            Following {
              followingAddress {
                socials {
                  fnames
                  profileName
                  profileTokenId
                  profileTokenIdHex
                  userId
                  userAssociatedAddresses
                  dappName
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        nextCursor
      }
    }
  }
`;

type SocialFollowing = {
  userId: string;
  profileName: string;
  profileTokenId: string;
  profileTokenIdHex: string;
  fnames: string[];
  userAssociatedAddresses: string[];
  dappName: 'farcaster' | 'lens';
};

type FollowingAddress = {
  socials: SocialFollowing;
};

type Following = {
  followingAddress: FollowingAddress;
};

type FollowerAddress = {
  socialFollowings: {
    Following: Following[];
  };
};

export type Follower = {
  followerAddress: FollowerAddress;
};

const fetchPaginated = async (url: string, query: string, variables: any) => {
  let hasNextPage = true;
  let cursor = '';
  let allData: any = [];

  while (hasNextPage && allData.length < 50) {
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: '97ef25ca56354e2e85a180f671d5c18c',
      },
      body: JSON.stringify({
        query,
        variables: {
          ...variables,
          ...(cursor && { cursor }),
        },
      }),
    });

    // eslint-disable-next-line no-await-in-loop
    const result = await response.json();

    if (result.errors) {
      console.error(result.errors);
      break;
    }

    const newData = result.data.SocialFollowers; // Adjust this based on the structure of your GraphQL response

    // Check if there are more pages
    hasNextPage = newData.pageInfo.hasNextPage;
    cursor = newData.pageInfo.nextCursor;

    // Concatenate the new data to the existing data
    allData = allData.concat(
      newData.Follower.flatMap((follower: any) =>
        follower.followerAddress?.socialFollowings?.Following?.flatMap(
          (following: any) => following.followingAddress.socials
        )
      ).filter(Boolean)
    );
  }
  return allData;
};

export const getFarcasterFollowsInCommon = async (addressA: string, addressB: string): Promise<string> => {
  const result = await fetchPaginated('https://api.airstack.xyz/graphql', FarcasterFollowsInCommonQuery, {
    identityA: addressA,
    identityB: addressB,
  });

  const followersInCommon =
    result?.filter((following: SocialFollowing) => following.dappName === 'farcaster' && following.profileName) ?? [];
  if (followersInCommon.length === 0) {
    return `No followers in common.`;
  }
  if (followersInCommon.length === 1) {
    return `Followed by **${followersInCommon[0]?.profileName as string}**`;
  }
  if (followersInCommon.length > 5) {
    return `Followed by **${followersInCommon[0]?.profileName as string}**, **${
      followersInCommon[1]?.profileName as string
    }**, **${followersInCommon[2]?.profileName as string}**, **${
      followersInCommon[3]?.profileName as string
    }**, and **${followersInCommon.length - 4} more you know**`;
  }
  return `Followed by **${followersInCommon[0]?.profileName as string}** and **${
    followersInCommon.length - 1
  } more you know**`;
};
