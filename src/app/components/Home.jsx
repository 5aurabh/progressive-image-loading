import React from "react";
import ProgressiveImageLoading from "./ProgressiveImageLoading";
import Card from "./Card";



const original_1 = "https://recruiter-static-content.s3.ap-south-1.amazonaws.com/test_progressive_images/banner-1.png";
const original_2 = "https://recruiter-static-content.s3.ap-south-1.amazonaws.com/test_progressive_images/banner-2.png";
const original_3 ="https://recruiter-static-content.s3.ap-south-1.amazonaws.com/test_progressive_images/banner-3.png";

import thumb from "assets/blur/banner-1.thumb.png";
import trace from "assets/blur/banner-2.thumb.png";
import primitive from "assets/blur/banner-3.thumb.png";

export default () =>
  <section className="section">
    <div className="container">
      <h1 className="title">Progressive Image Loading examples</h1>
    </div>

    <div className="container">
      <h2 className="title">Fatest option</h2>
      <Card title="Thumb + Blur" thumb={thumb}
            text={"Thumb of 64px and blur, 2 kbytes (inlined) ~0.3% of original size"}>
        <ProgressiveImageLoading src={original_1} thumb={thumb} blur={true}/>
      </Card>
      <h2 className="title">Middle term</h2>
      <Card title="Image Trace" thumb={trace} text={"Trace on a 128px version, 21kb ~3% of original size"}>
        <ProgressiveImageLoading src={original_2} thumb={trace}/>
      </Card>
      <h2 className="title">Visually the best option</h2>
      <Card title="Image Primitives" thumb={primitive}
            text={"500 elipses on a 512px version, 42kb ~6% of original size"}>
        <ProgressiveImageLoading src={original_3} thumb={primitive}/>
      </Card>
    </div>
  </section>