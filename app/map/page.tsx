import dynamic from "next/dynamic";

// @arcgis/core does not currently work with SSR, so we need to disable it for the map component
const JobMapNoSSR = dynamic(() => import("@/components/JobMap"), {
  ssr: false,
});

export default function Map() {
  return <JobMapNoSSR />;
}
