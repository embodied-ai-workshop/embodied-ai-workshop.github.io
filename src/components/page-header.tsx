import React from "react";
import { Link } from "gatsby";
import * as style from "./page-header.module.scss";
import { Popover, Button } from "antd";
import { DownOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import SeattleCover from "../../static/images/cvpr2020/cover-transparent.svg";
import { css } from "@emotion/react";

// This will eventually show the 2021 challenges as a dropdown
// on the header row. 2021 info coming soon!
// For now, it's still in place so that the title is centered.
export const Challenges = (props: {
  onLeft?: boolean;
  conference: string;
  challengeData: React.ReactNode[];
}) => (
  <div className={props.onLeft === true ? style.left : style.right}>
    <Popover
      placement={props.onLeft === true ? "bottomLeft" : "bottomRight"}
      content={
        <div>
          {props.challengeData.map((challenge: React.ReactNode) => (
            <div
              css={css`
                text-align: ${props.onLeft === true ? "left" : "right"};
              `}
            >
              {challenge}
            </div>
          ))}
        </div>
      }
      trigger="hover"
    >
      <Button
        css={css`
          background: none !important;
          color: inherit;
          border: none;
          box-shadow: none;
          padding: 0px;
          font-size: 15px;
          &:hover {
            color: #1d3d7e;
          }
        `}
      >
        {props.onLeft === true ? (
          <>
            <DownOutlined style={{ fontSize: "14px" }} /> {props.conference}{" "}
            Challenges
          </>
        ) : (
          <>
            {props.conference} Challenges{" "}
            <DownOutlined style={{ fontSize: "14px" }} />{" "}
          </>
        )}
      </Button>
    </Popover>
  </div>
);

// This will eventually allow the old workshops (e.g., CVPR 2020)
// to be accessible from the header. Waiting until 2021 info is up
// for this to display anything.
export const OtherYears = (props: { onConference: string }) => (
  <div className={style.left}>
    <Popover
      placement={"bottomLeft"}
      content={
        <div>
          <div>
            {props.onConference === "CVPR 2026" ? (
              <>CVPR 2026</>
            ) : (
              <Link to="/cvpr2026">CVPR 2026</Link>
            )}
          </div>
          <div>
            {props.onConference === "CVPR 2025" ? (
              <>CVPR 2025</>
            ) : (
              <Link to="/cvpr2025">CVPR 2025</Link>
            )}
          </div>
          <div>
            {props.onConference === "CVPR 2024" ? (
              <>CVPR 2024</>
            ) : (
              <Link to="/cvpr2024">CVPR 2024</Link>
            )}
          </div>
          <div>
            {props.onConference === "CVPR 2023" ? (
              <>CVPR 2023</>
            ) : (
              <Link to="/cvpr2023">CVPR 2023</Link>
            )}
          </div>
          <div>
            {props.onConference === "CVPR 2022" ? (
              <>CVPR 2022</>
            ) : (
              <Link to="/cvpr2022">CVPR 2022</Link>
            )}
          </div>
          <div>
            {props.onConference === "CVPR 2021" ? (
              <>CVPR 2021</>
            ) : (
              <Link to="/cvpr2021">CVPR 2021</Link>
            )}
          </div>
          <div>
            {props.onConference === "CVPR 2020" ? (
              <>CVPR 2020</>
            ) : (
              <Link to="/cvpr2020">CVPR 2020</Link>
            )}
          </div>
          <div>
            {props.onConference === "EAI Blog" ? (
              <>EAI Blog</>
            ) : (
              <Link to="https://medium.com/embodied-artificial-intelligence">EAI Blog</Link>
            )}
          </div>
        </div>
      }
      trigger="hover"
    >
      <Button
        css={css`
          background: none !important;
          color: inherit;
          border: none;
          box-shadow: none;
          padding: 0px;
          font-size: 15px;
          &:hover {
            color: #1d3d7e !important;
          }
        `}
      >
        <DownOutlined style={{ fontSize: "14px" }} /> Embodied AI Workshops
      </Button>
    </Popover>
  </div>
);

// Sets the page title and the dynamic header. Eventually, this will
// probably be modularized even further, when future versions come out.
// For now, were just using a single cover image.
export const Header = (props: {
  conference: string;
  rightSide: React.ReactNode;
  leftSide: React.ReactNode;
  imageContent: any;
  headerGradient: string;
  headerStyle: any;
  headerContainer: any;
}) => (
  <>
    <div
      css={css`
        background: ${props.headerGradient};
        ${props.headerStyle};
      `}
      className={style.header}
    >
      <div className={style.headerContent}>
        {props.leftSide}
        <div className={style.middle}>
          <div className={style.workshopTitle}>Embodied AI Workshop</div>
          <div className={style.conference}>{props.conference}</div>
        </div>
        {props.rightSide}
        <div id="headerContainer" {...props.headerContainer}>
          <div {...props.imageContent} />
        </div>
      </div>
    </div>
  </>
);

export default Header;
