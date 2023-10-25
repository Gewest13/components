import React from "react";
import { render } from "@testing-library/react";
import { Image } from "../Image";

describe("Image", () => {
  test("renders the Image component", () => {
    render(
      <Image 
      src={{
        mobile: {
          mediaItemUrl: '/static/media/src/stories/assets/image.jpg'
        },
        tablet: {
          mediaItemUrl: '/static/media/src/stories/assets/image.jpg'
        },
        desktop: {
          mediaItemUrl: '/static/media/src/stories/assets/image.jpg'
        }}
      }
      margins={{
        mobile: [100, 0, 100, 0],
        tablet: [100, 0, 100, 0],
        desktop: [100, 0, 100, 0]}
      }
      ratios={{
        mobile: [200, 200],
        tablet: [100, 100],
        desktop: [100, 100]}
      } 
      />
    );
  });
});