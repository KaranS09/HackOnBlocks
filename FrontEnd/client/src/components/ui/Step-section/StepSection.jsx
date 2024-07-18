import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import "./step-section.css";

const STEP__DATA = [
  {
    title: "Setup your wallet",
    desc: "Setup your walllet and start Buying and selling valuables in order to predict the score of the user",
    icon: "ri-wallet-line",
  },

  {
    title: "Create your collection",
    desc: "Post your collection of valuables and start selling them to the users in order to predict the score of the user",
    icon: "ri-layout-masonry-line",
  },

  {
    title: "Add your Valuables",
    desc: "Store your art and valuables and keep it in vault if you want ",
    icon: "ri-image-line",
  },

  {
    title: "List them for sale",
    desc: "List and trade them for sale and start predicting the score of the user",
    icon: "ri-list-check",
  },
];

const StepSection = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-4">
            <h3 className="step__title">Create and sell your Valuables</h3>
          </Col>

          {STEP__DATA.map((item, index) => (
            <Col lg="3" md="4" sm="6" key={index} className="mb-4">
              <div className="single__step__item">
                <span>
                  <i class={item.icon}></i>
                </span>
                <div className="step__item__content">
                  <h5>
                    <Link to="/wallet">{item.title}</Link>
                  </h5>
                  <p className="mb-0">{item.desc}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StepSection;
