import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import "./heroSection.css";
import mainImg from "../../assets/images/mainpg1.png";

const HeroSection = () => {
  return (
    <section className="hero__section">
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="hero__content">
              <h2>
                Get your CreditScore Based on Wallet transactions{" "}
                <span>Store and sell </span>Valuables
              </h2>
              <p>
                CreDefi stores your valuable required and gives you a feature of
                selling them online , MoreOf based on your transactions it gives
                a CreditScore for future Web3 Trasactions!
              </p>
              <div className="hero__btns d-flex align-items-center gap-4">
                <button className=" explore__btn d-flex align-items-center gap-2">
                  <i class="ri-rocket-line"></i>
                  <Link to="/market">Explore</Link>
                </button>
                <button className=" create__btn d-flex align-items-center gap-2">
                  <i class="ri-ball-pen-line"></i>
                  <Link to="/market">Create</Link>
                </button>
              </div>
            </div>
          </Col>
          <Col lg="6" md="6">
            <div className="hero__img">
              <img src={mainImg} alt="" className="w-100" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
