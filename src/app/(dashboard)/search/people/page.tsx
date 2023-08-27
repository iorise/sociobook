import React from "react";
import { PeopleSearchComponent } from "@/components/search-component";
import { Metadata } from "next";

interface Props {
  query: {
    keyword: string;
  };
}

export async function generateMetadata({ query }: Props): Promise<Metadata> {
  const searchKeyword = query.keyword;
  const description = `Search results for: ${searchKeyword}`;

  return {
    title: `${searchKeyword} - Search Result | Facebook`,
    description
  };
}

export default function PeopleSearchPage() {
  return (
    <div>
      <PeopleSearchComponent />
    </div>
  );
}
