import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Machines from "./Machines";

describe("<Machines/>", () => {
  it("renders assets-map class", () => {
    const wrapper = shallow(<Machines />);
    expect(wrapper.find(".assets-map")).to.have.lengthOf(1);
  });

  it("renders copyright message for image", () => {
    const wrapper = shallow(<Machines />);
    expect(wrapper.find("#copyright")).to.have.lengthOf(1);
  });
});
