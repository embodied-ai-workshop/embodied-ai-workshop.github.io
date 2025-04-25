// import React, { useState, useEffect } from "react";
import * as React from "react";

import { graphql, Link } from "gatsby";
import { Section, SubSection } from "../components/text-helpers";

import PageWrapper from "../components/page-wrapper";

import color from "../components/color";
import { Challenges } from "../components/page-header";
import { Table, Steps, Timeline } from "antd";
import LaunchIcon from "@material-ui/icons/Launch";
import ReceiptIcon from "@material-ui/icons/Receipt";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import moment from "moment-timezone";
import Img, { FixedObject, FluidObject } from "gatsby-image";

import SlackLogo from "../../static/icons/slack.svg";

const { Step } = Steps;

import { Speaker, LiveSession, Video } from "./cvpr2020";

import { OrganizerPics } from "./cvpr2020";
import { css } from "@emotion/react";

import "@allenai/varnish/theme.css";
/**
 * Return true if an email is formatted correctly, otherwise false.
 * Taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
 * @param email the input email
 */
function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function ChallengeVideo(props: {
  url: string;
  imageQuery: string;
  data: object;
}) {
  return (
    <Video fontSize="45px" url={props.url}>
      <Img fluid={props.data[props.imageQuery].childImageSharp.fluid} />
    </Video>
  );
}

function ChallengeSpotlight(props: {
  url: string;
  imageQuery: string;
  data: object;
  width?: string;
  playSize?: string;
  display?: string;
  rank: string;
}) {
  return (
    <div
      css={css`
        width: ${props.width ? props.width : "175px"};
        margin-bottom: 12px;
        display: ${props.display ? props.display : "inline-block"};
        text-align: center;
        margin-right: ${props.display === "block" ? "auto" : "4px"};
        margin-left: ${props.display === "block" ? "auto" : "4px"};
      `}
    >
      <Video
        fontSize={props.playSize ? props.playSize : "25px"}
        url={props.url}
      >
        <Img fluid={props.data[props.imageQuery].childImageSharp.fluid} />
      </Video>
      <div
        css={css`
          background-color: ${color.gray4};
          border-radius: 0px 0px 3px 3px;
          border-right: 1px solid ${color.gray6};
          border-left: 1px solid ${color.gray6};
          border-bottom: 1px solid ${color.gray6};
        `}
      >
        {props.rank}
      </div>
    </div>
  );
}

const challengePageMap = {
  ARNOLD: (
    <a href="https://sites.google.com/view/arnoldchallenge/" target="_blank">
      ARNOLD
    </a>
  ),
  HAZARD: (
    <a href="https://embodied-agi.cs.umass.edu/hazard" target="_blank">
      HAZARD
    </a>
  ),
  ManiSkillViTac: (
    <a href="https://ai-workshops.github.io/maniskill-vitac-challenge-2025/" target="_blank">
      ManiSkill-ViTac
    </a>
  ),
  SMM: (
    <a href="https://smm-challenge.github.io/" target="_blank">
      Social Mobile Manipulation
    </a>
  ),
};

function EmailSubscription(props: {
  actionIdentifier: string;
  entryNumber: number;
}) {
  const [submitted, setSubmitted] = React.useState(false),
    [emailFocused, setEmailFocused] = React.useState(false),
    [inputEmail, setInputEmail] = React.useState("");

  const emailIsValid = validateEmail(inputEmail);

  return (
    <div
      css={css`
        text-align: center;
        margin-top: 60px;
        margin-bottom: 60px;
      `}
    >
      <form
        encType="text/plain"
        action={
          emailIsValid
            ? `https://docs.google.com/forms/d/e/${props.actionIdentifier}/formResponse?usp=pp_url&entry.${props.entryNumber}=${inputEmail}`
            : ``
        }
        target={`hidden_iframe${props.actionIdentifier}`}
        onSubmit={() => (emailIsValid ? setSubmitted(true) : false)}
        method="post"
      >
        <div
          css={css`
            margin-bottom: 10px;
          `}
        >
          <div
            css={css`
              font-weight: bold;
              font-size: 25px;
              color: "#2b4acb";
              vertical-align: middle;
              display: inline-block;
            `}
          >
            Sign Up for Updates
          </div>
          <div
            css={css`
              vertical-align: middle;
              display: inline-block;
              margin-top: 6px;
              margin-left: 5px;
            `}
          >
          </div>
        </div>
        {submitted ? (
          <div>Thanks for signing up!</div>
        ) : (
          <>
            <div
              css={css`
                border-radius: 5px;
                box-shadow: 0px 0px 2px 0px #2b4acb;
                display: inline-block;
                margin: auto;
                * {
                  padding-top: 3px;
                  padding-bottom: 5px;
                }
              `}
            >
              <input
                type="email"
                autoComplete="off"
                placeholder="email"
                name={`entry.${props.entryNumber}`}
                id={`entry.${props.entryNumber}`}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setInputEmail(event.target.value)
                }
                value={inputEmail}
                css={css`
                  background-color: transparent;
                  transition-duration: 0.3s;
                  box-shadow: 0px 0px 1px 2px
                    ${!emailFocused && !emailIsValid && inputEmail != ""
                      ? "#ff7875"
                      : "transparent"};
                  border: none;
                  width: 350px;
                  @media (max-width: 500px) {
                    width: 55vw;
                  }
                  border-radius: 5px;
                  padding-left: 8px;
                `}
              />
              <input
                type={emailIsValid ? "submit" : "button"}
                value="Sign Up"
                onClick={() => (emailIsValid ? true : false)}
                css={css`
                  background-color: transparent;
                  border: none;
                  font-weight: 600;
                  transition-duration: 0.3s;
                  color: ${emailIsValid ? "#2b4acb" : "#2b4acb" + "88"};
                  padding-top: 3px;
                  padding-right: 12px;
                  padding-left: 10px;
                  &:hover {
                    cursor: ${emailIsValid ? "pointer" : "default"};
                  }
                `}
              />
            </div>
            <div
              css={css`
                margin-top: 5px;
                color: ${"#8c8c8c"};
              `}
            >
              You can unsubscribe at any time.
            </div>
          </>
        )}
      </form>
      <iframe
        name={`hidden_iframe${props.actionIdentifier}`}
        id={`hidden_iframe${props.actionIdentifier}`}
        css={css`
          display: none !important;
        `}
      />
    </div>
  );
}

function getWindowWidth() {
  if (typeof window === "undefined") {
    // this only happens when statically building.
    return 800;
  }
  const { innerWidth: width } = window;
  return width;
}

function PaperButton(props: { text: string; url: string;  }) {
  return (
    <a
      href={props.url}
      target="_blank"
      css={css`
        margin-right: 10px;
      `}
    >
      <div
        css={css`
          display: inline-block;
          border: 1px solid ${color.gray5};
          background-color: ${color.gray2};
          padding-left: 7px;
          padding-right: 7px;
          border-radius: 5px;
          transition-duration: 0.15s;
          > span {
            vertical-align: middle;
          }

          &:hover {
            background-color: ${color.gray4};
            border: 1px solid ${color.gray6};
          }
        `}
      >
        <span
          css={css`
            margin-left: 5px;
            color: ${color.gray10};
          `}
        >
          {props.text}
        </span>
      </div>
    </a>
  );
}

function Abstract(props: {
  text: string;
}) {
  const [showFullText, setShowFullText] = React.useState(false);

  let text;
  if (props.text.indexOf(" ", 250) === -1) {
    text = <div>{props.text}</div>;
  } else {
    text = (
      <div>
        {showFullText
          ? props.text + " "
          : (props.text.indexOf(". ") + 2 > 250 ? props.text.slice(0, props.text.indexOf(". ") + 2) : props.text.slice(0, 250) + "... ")}
        <span
          css={css`
            color: ${color.light.blue6};
            &:hover {
              cursor: pointer;
            }
          `}
          onClick={() => setShowFullText(prev => !prev)}
        >
          [{!showFullText ? "Expand" : "Collapse"}]
        </span>
      </div>
    );
  }

  return (
    <div
      css={css`
        padding: 20px;
        background: ${color.gray1};
        border: 1px solid ${color.gray5 + "cc"};
        box-shadow: 0px 0px 100px 0px ${color.gray4};
        border-radius: 0px;
        padding-bottom: 45px;
        text-align: left;
        vertical-align: top;
        display: inline-block;
        position: relative;
        @media (min-width: 601px) {
          min-height: 25px;
        }
      `}
    >
      {text}
    </div>
  );
}

function Paper(props: {
  title: string;
  abstract: string;
  authors: object;
  affiliations: string[];
  pdf: string;
  poster?: string;
}) {
  const [showFullAbstract, setShowFullAbstract] = React.useState(false);

  let abs;
  if (props.abstract.indexOf(" ", 250) === -1) {
    abs = <div>{props.abstract}</div>;
  } else {
    abs = (
      <div>
        {showFullAbstract
          ? props.abstract + " "
          : props.abstract.slice(0, props.abstract.indexOf(". ") + 2)}
        <span
          css={css`
            color: ${color.light.blue6};
            &:hover {
              cursor: pointer;
            }
          `}
          onClick={() => setShowFullAbstract(prev => !prev)}
        >
          [{!showFullAbstract ? "Expand" : "Collapse"}]
        </span>
      </div>
    );
  }


  return (
    <div
      css={css`
        padding: 20px;
        background: ${color.gray1};
        border: 1px solid ${color.gray5 + "cc"};
        box-shadow: 0px 0px 100px 0px ${color.gray4};
        border-radius: 0px;
        padding-bottom: 45px;
        text-align: left;
        vertical-align: top;
        display: inline-block;
        position: relative;
        @media (min-width: 601px) {
          min-height: 250px;
        }
      `}
    >
      <a href={props.pdf} target="_blank">
        <div
          css={css`
            font-weight: 600;
            line-height: 20px;
            color: ${color.light.blue7};
            font-size: 15px;
            transition-duration: 0.15s;
            &:hover {
              color: ${color.light.blue6};
            }
          `}
        >
          {props.title}
        </div>
      </a>
      <div
        css={css`
          margin-bottom: 8px;
          color: ${color.gray8};
          line-height: 20px;
          font-size: 13px;
          /* margin-top: 5px; */
        `}
      >
        {Object.keys(props.authors).map((name: string, i: number) => (
          <>
            <span>{name}</span>
            <sup></sup>
            {i !== Object.keys(props.authors).length - 1 ? ", " : ""}
          </>
        ))}
      </div>
      {abs}
      <div
        css={css`
          position: absolute;
          bottom: 10px;
          width: calc(100% - 40px);
          padding-top: 5px;
        `}
      >
        <PaperButton text="PDF"  url={props.pdf} />
        {props.poster ? (
          <PaperButton
            text="Poster"
            url={props.poster}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

let acceptedPapers = [];
  
const Time = (props: { time: string }) => (
  <span
    css={css`
      color: ${color.gray7};
    `}
  >
    {props.time}
  </span>
);

const paperOrder = shuffle([...Array(acceptedPapers.length).keys()]);

// taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function InlineSlack() {
  return (
    <div>
      <a
        href="//join.slack.com/t/embodied-aiworkshop/shared_invite/zt-s6amdv5c-gBZQZ7YSktrD_tMhQDjDfg"
        target="_blank"
      >
        <div
          css={css`
            display: inline-block;
            /* border: 1px solid ${color.gray6}; */
            border-radius: 0px 10px 0px 10px;
            padding-left: 10px;
            padding-right: 10px;
            margin-top: 3px;
            padding-top: 3px;
            padding-bottom: 4px;
            background-color: #4a154b;
            transition-duration: 0.15s;
            color: white;
            &:hover {
              cursor: pointer;
              filter: contrast(1.25);
            }
            > span,
            > img {
              vertical-align: middle;
            }
          `}
        >
          <img
            src={SlackLogo}
            css={css`
              width: 15px;
              margin-right: 5px;
            `}
          />{" "}
          <span>
            Ask questions on <b>Slack</b>
          </span>
        </div>
      </a>
    </div>
  );
}

function Slack() {
  return (
    <a
      href="//join.slack.com/t/embodied-aiworkshop/shared_invite/zt-s6amdv5c-gBZQZ7YSktrD_tMhQDjDfg"
      target="_blank"
    >
      <div
        css={css`
          background-color: #4a154b;
          color: white;
          padding: 15px 15px;
          border-radius: 10px 0px 10px 0px;
          transition-duration: 0.15s;

          &:hover {
            cursor: pointer;
            filter: contrast(1.25);
            box-shadow: 0px 0px 15px 0px ${color.gray6};
          }
        `}
      >
        <img
          src={SlackLogo}
          css={css`
            height: 20px;
            vertical-align: middle;
            margin-right: 7px;
          `}
        />
        <div
          css={css`
            display: inline-block;
            vertical-align: middle;
          `}
        >
          Ask Questions on <b>Slack</b>
        </div>
        <div
          css={css`
            background-color: white;
            color: black;
            padding: 5px;
            padding-top: 6px;
            padding-bottom: 3px;
            padding-left: 5px;
            margin-top: 12px;
            border-radius: 10px 0px 10px 0px;
          `}
        >
          Questions can be asked{" "}
          <b>anonymously</b>.
        </div>
      </div>
    </a>
  );
}




// And finally, we add all the content into their respective sections.
export default function Home({ data }) {
    const [windowWidth, setWindowWidth] = React.useState(getWindowWidth());
  
    React.useEffect(() => {
      const resizeWindow = () => setWindowWidth(getWindowWidth());
      window.addEventListener("resize", resizeWindow);
      return () => window.removeEventListener("resize", resizeWindow);
    });
  
    const challengeData = [
      {
        challenge: challengePageMap["ARNOLD"],
        key: "arnold",
        task: "Language-Grounded Manipulation",
        interactiveActions: "✓",
        simulationPlatform: "Isaac Sim",
        sceneDataset: "Arnold Dataset",
        observations: "RGB-D, Proprioception",
        actionSpace: "Continuous",
        stochasticAcuation: "✓",
        winner: "",
      },
      {
        challenge: challengePageMap["HAZARD"],
        key: "hazard",
        task: "Multi-Object Rescue",
        interactiveActions: "✓",
        simulationPlatform: "ThreeDWorld",
        sceneDataset: "HAZARD dataset",
        observations: "RGB-D, Sensors, Temperature",
        actionSpace: "Discrete",
        stochasticAcuation: "",
        winner: "",
      },
      {
        challenge: challengePageMap["ManiSkillViTac"],
        key: "maniskill-vitac",
        task: "Generalized Manipulation / Vision-Based Tactile Manipulation",
        interactiveActions: "✓",
        simulationPlatform: "SAPIEN",
        sceneDataset: "PartNet-Mobility, YCB, EGAD",
        observations: "RGB-D, Proproioception, Localization",
        actionSpace: "Continuous / Discrete for ViTac",
        stochasticAcuation: "",
        winner: "",
      },
      {
        challenge: challengePageMap["SMM"],
        key: "SMM",
        task: "Social Mobile Manipulation",
        interactiveActions: "✓",
        simulationPlatform: "TBD",
        sceneDataset: "TBD",
        actionSpace: "Continuous",
        observations: "RGB-D, Sensors, Pose Data, Tactile Sensors",
        stochasticAcuation: "",
        winner: "",
      },
    ];
  
    // useEffect(() => {
    //   setPaperOrder(prevOrder => shuffle(prevOrder));
    // }, []);
  
    // using 4:59 since PST is 5 hours behind AoE.
    const paperDeadline = moment.tz("2022-05-17 04:59", "America/Los_Angeles");
    const currentTime = moment();
    const duration = moment.duration(paperDeadline.diff(currentTime));
  
    const hoursLeft = Math.ceil(duration.asHours() % 24);
    const daysLeft = Math.floor(duration.asDays());

    return (
        <PageWrapper
        // Prior variant
        // headerGradient="radial-gradient(#090617, #090617)"
        // 2023 variant
        // headerGradient="linear-gradient(0deg, #1f2f3f, #100b0f)"
        // 2024 variant
        // headerGradient="radial-gradient(#330066, #ff9933)"
        headerGradient="linear-gradient(0deg, #e2d2b9, #153968)"
        
        headerStyle={css`
          color: ${color.dark.gold10} !important;
          button {
            &:hover {
              color: ${color.dark.gold9} !important;
            }
          }
        `}
        imageContent={{
          css: css`
            width: 130%;
            background-repeat: no-repeat;
            padding-top: 70.25%;
            margin-top: 0px;
            margin-left: -15%;
            margin-bottom: -15px;
            background-image: url("/images/cvpr2025/cover-small.png");
            background-size: cover;
            background-position: center;
          `,
        }}
        conference="CVPR 2025 - Nashville"
        rightSide={
          <Challenges
            conference="CVPR 2025"
            challengeData={Object.values(challengePageMap)}
          />
        }
      >
      <Section title="Overview">
        <p>
          Minds live in bodies, and bodies move through a changing world.
          The goal of embodied artificial intelligence is to create agents,
          such as robots, which learn to creatively solve challenging tasks
          requiring interaction with the environment.

          While this is a tall order, fantastic advances in deep learning and the
          increasing availability of large datasets like ImageNet have enabled
          superhuman performance on a variety of AI tasks previously thought
          intractable. Computer vision, speech recognition and natural language
          processing have experienced transformative revolutions at passive
          input-output tasks like language translation and image processing,
          and reinforcement learning has similarly achieved world-class
          performance at interactive tasks like games.

          These advances have supercharged embodied AI, enabling a growing
          collection of researchers to make rapid progress towards intelligent
          agents which can:         
        </p>
        <ul>
          <li>
            <b>
              See
            </b>
            : perceive their environment through vision or other senses.
          </li>
          <li>
            <b>
              Talk
            </b>
            : hold a natural language dialog grounded in their environment.
          </li>
          <li>
            <b>
              Listen
            </b>
            : understand and react to audio input anywhere in a scene.
          </li>
          <li>
            <b>
              Act
            </b>
            : navigate and interact with their environment to accomplish goals.
          </li>
          <li>
            <b>
              Reason
            </b>
            : consider and plan for the long-term consequences of their actions.
          </li>
        </ul>
        <p>
          The goal of the Embodied AI workshop is to bring together researchers
          from computer vision, language, graphics, and robotics to share
          and discuss the latest advances in embodied intelligent agents.
          EAI 2025’s overaching theme 
          is <b>Real-World Applications:</b> creating embodied AI solutions that are
          deployed in real-world environments, ideally in the service of real-world tasks.
          Embodied AI agents are maturing, and the community should promote work that
          transfers this research out of simulation and laboratory environments into
          real-world settings.
           
           This umbrella theme is divided into four topics:
           <ul>
            <li>             
              <b>Embodied AI Solutions</b> As embodied AI solutions become more powerful, we should
              demand of them that they
              solve more complex problems - particularly real-world problems outside of simulation
              and the laboratory. While scientific advances are of interest, we are actively
              seeking work that applies embodied AI to real-world industry applications.
              </li>
            <li>
              <b>Advances in Simulation</b> Advances in simulation have enabled many embodied AI
               algorithms. Procedural
              simulation, parameterized simulation, differentiable simulation and world
              models are of interest, as are simulations based on the increasing numbers
              of large embodied datasets.
              </li>
            <li>
              <b>Generative Methods for Embodied AI</b> Generative AI is becoming an increasingly
              important for embodied artificial
              intelligence research. Topics such as generative AI for simulation, generative
              AI for data generation, and generative AI for policies (e.g., diffusion policies
              and world models) are of great interest.
              </li>
            <li>
              <b>Foundation Models</b> Large-scale pretrained models adaptable to new tasks
               first came to the
              forefront in the domains of language, speech, and vision, but increasingly
              foundation models are being developed in robotics domains including action,
              perception, problem solving, and simulation. We invite both language model
              planning research that adapts existing models to embodied problems as well
              as embodied foundation models that are trained directly on embodied problems.
            </li>
           </ul>

          The Embodied AI 2025 workshop will be held in conjunction with
          {" "}<a href="https://cvpr.thecvf.com/Conferences/2025">CVPR 2025</a>{" "}
          in Nashville, Tennessee. It will feature a host of invited
          talks covering a variety of topics in Embodied AI, many exciting 
          Embodied AI challenges, a poster session, and panel discussions.
          
          For more information on the Embodied AI Workshop series, see our 
          {" "}<a href="https://arxiv.org/abs/2210.06849">Retrospectives</a>{" "}
          paper on the first three years of the workshop. For the latest updates,
          follow the Embodied AI Medium blog at
          {" "}<a  href="https://medium.com/embodied-artificial-intelligence">medium.com/embodied-artificial-intelligence</a>.
        </p>
        <EmailSubscription
          actionIdentifier="1FAIpQLSeIZrn-tk7Oain2R8gc_Q0HzLMLQ9XXwqu3KecK_E5kALpiug"
          entryNumber={1834823104}
        />
        </Section>
        <Section title="Timeline">
      <Steps progressDot current={1} direction="vertical">
          <Step title="Workshop Announced" description="March 31st, 2025" />
          <Step
            title="Paper Submission Deadline"
            description="Friday May 16th, 2025"
          />
          <Step
            title="Paper Notification Deadline"
            description="Monday May 26th, 2025"
          />
          <Step
            title="Challenge Submission Deadlines"
            description="May-June 2025. Check each challenge for the specific date."
          />
          <Step
            title="Sixth Annual Embodied AI Workshop at CVPR"
            description={
              <>
                <a href={"https://cvpr.thecvf.com/Conferences/2025"} target="_blank">
                  Nashville, Tennessee
                </a>{" "}
                <br />
                June 12, 2025
                <br />
                <span
                  css={css`
                    color: ${color.gray7};
                  `}
                >
                </span>
              </>
            }
          ></Step>
          <Step
            title="Challenge Winners Announced"
            description="At the workshop. Check each challenge for specifics."
          />
               </Steps>
      </Section>
      <Section title="Workshop Schedule">
        
        Embodied AI will be a <b>hybrid</b> workshop, with both in-person talks and streaming via zoom.
        <ul>
          <li><b>Workshop Talks: 8:50AM-5:30PM PT - TBD</b></li>
          <li><b>Poster Session: 1:00PM-2:00PM PT - TBD</b></li>
        </ul>
        Zoom information is forthcoming.
        <br />
        Remote and in-person attendees are welcome to ask questions via Slack:  
        <br />

                      <InlineSlack />
                      <br />
                <div
                  css={css`
                    margin-left: 0px;
                    margin-top: 20px;
                  `}
                >
                  Detailed schedule forthcoming.
                </div>
      </Section>
      <Section title="Sponsor Events">
        <p>
          Stay tuned for information about events associated with our sponsors!
          </p>
        <br />
      </Section>
      <Section title="Challenges">
        <p>
          The Embodied AI 2025 workshop is hosting many exciting challenges
          covering a wide range of topics. More
          details regarding data, submission instructions, and timelines can be
          found on the individual challenge websites.
        </p>
        <p>
          The workshop organizers will award each first-prize challenge winner
          a cash prize, sponsored by Logical Robotics and our other sponsors.
        </p>
        <p>
          Challenge winners may be given the opportunity to present during their
          challenge's presentation at the
          the workshop. Since many challenges can be grouped into similar tasks,
          we encourage participants to submit models to more than 1 challenge.
          The table below describes, compares, and links each challenge.
        </p>
        <Table
          scroll={{ x: "1500px" }}
          css={css`
            margin-top: 25px;
            margin-bottom: 50px;
          `}
          sticky={true}
          columns={[
            {
              title: (
                <>
                  Challenge
                </>
              ),
              dataIndex: "challenge",
              key: "challenge",
              fixed: windowWidth > 650 ? "left" : "",
              // fixed: "left",
            },
            {
              title: (
                <>
                  Task
                </>
              ),
              dataIndex: "task",
              key: "task",
              sorter: (a, b) => a.task.localeCompare(b.task),
              sortDirections: ["ascend", "descend"],
            },
            {
              title: (
                <>
                  2024 Winner
                </>
              ),
              dataIndex: "winner",
              key: "winner",
              sorter: (a, b) => a.task.localeCompare(b.winner),
              sortDirections: ["ascend", "descend"],
            },
            {
              title: (
                <>
                  Simulation Platform
                </>
              ),
              dataIndex: "simulationPlatform",
              key: "simulationPlatform",
              sorter: (a, b) =>
                a.simulationPlatform.localeCompare(b.simulationPlatform),
              sortDirections: ["ascend", "descend"],
              width: 200,
            },
            {
              title: (
                <>
                  Scene Dataset
                </>
              ),
              dataIndex: "sceneDataset",
              key: "sceneDataset",
              sorter: (a, b) => a.sceneDataset.localeCompare(b.sceneDataset),
              sortDirections: ["ascend", "descend"],
              width: 180,
            },
            {
              title: (
                <>
                  Observations
                </>
              ),
              key: "observations",
              dataIndex: "observations",
              sorter: (a, b) => a.observations.localeCompare(b.observations),
              sortDirections: ["ascend", "descend"],
              width: 170,
            },
            {
              title: (
                <div
                  css={css`
                    text-align: center;
                  `}
                >
                  Action Space
                </div>
              ),
              key: "actionSpace",
              dataIndex: "actionSpace",
              sorter: (a, b) => a.actionSpace.localeCompare(b.actionSpace),
              sortDirections: ["ascend", "descend"],
              width: 165,
            },
            {
              title: (
                <>
                  Interactive Actions?
                </>
              ),
              dataIndex: "interactiveActions",
              key: "interactiveActions",
              sorter: (a, b) =>
                a.interactiveActions.localeCompare(b.interactiveActions),
              sortDirections: ["descend", "ascend"],
              width: 200,
            },
            {
              title: (
                <>
                  Stochastic Acuation?
                </>
              ),
              key: "stochasticAcuation",
              dataIndex: "stochasticAcuation",
              sorter: function (a, b) {
                // let's favor the checks over any text.
                let aActuation =
                  a.stochasticAcuation === "✓" ? "Z" : a.stochasticAcuation;
                let bActuation =
                  b.stochasticAcuation === "✓" ? "Z" : b.stochasticAcuation;
                return aActuation.localeCompare(bActuation);
              },
              sortDirections: ["descend", "ascend"],
              // width: 225,
            },
          ]}
          dataSource={challengeData}
          pagination={false}
        />
        {/* <SubSection title="Challenge Results">Hello, world.</SubSection> */}
      </Section>
      <Section title="Call for Papers">
        <p>
          We invite high-quality 2-page extended abstracts on embodied AI,
          especially in areas relevant to the themes of this year's workshop:
          <ul>
            <li>
              Embodied AI Solutions
            </li>
            <li>
              Advances in Simulation
            </li>
            <li>
              Generative Methods for Embodied AI
            </li>
            <li>
              Foundation Models
            </li>
          </ul>
          as well as themes related to embodied AI in general:
          <ul>
            <li>
              Visual Navigation
            </li>
            <li>
              Embodied Mobile Manipulation
            </li>
            <li>
              Embodied Question Answering
            </li>
            <li>
              Embodied Vision &amp; Language
            </li>
            <li>
              Language Model Planning
            </li>
          </ul>
          Accepted papers will be presented as posters or spotlight talks at the
          workshop. These papers will be made publicly available in a
          non-archival format, allowing future submission to archival journals
          or conferences. Paper submissions do not have to be anononymized. Per{" "}
          <a
            href="https://cvpr.thecvf.com/Conferences/2025/AuthorGuidelines"
            target="_blank"
          >
            CVPR rules
          </a>{" "}
          regarding workshop papers, at least one author must register for CVPR
          using an in-person registration.
        </p>
        <SubSection title="Submission">
          <p>
            The submission deadline is <b>May 16th</b> (
            <a href="//time.is/Anywhere_on_Earth">Anywhere on Earth</a>). Papers
            should be no longer than 2 pages (excluding references) and styled
            in the{" "}
            <a href="https://cvpr.thecvf.com/Conferences/2025/AuthorGuidelines" target="_blank">
              CVPR format
            </a>.
            <ul>
              <li>
              <a href="https://openreview.net/group?id=thecvf.com/CVPR/2025/Workshop/EAI">
              Paper submissions are now OPEN through May 16th, 2025.
              </a>
              <br></br>
              Notifications will be sent by May 26th, 2025.
              {/* The <a href="https://openreview.net/group?id=thecvf.com/CVPR/2023/Workshop/EAI">paper submission link is LIVE.</a> */}
              </li>
            </ul>
            
          </p>
        </SubSection>
        <SubSection title="Accepted Papers">
          <p>
            <b>Note.</b> The order of the papers is randomized each time the
            page is refreshed.
          </p>
          <div
            css={css`
              display: grid;
              grid-gap: 2%;
              grid-row-gap: 20px;
              grid-template-columns: 49% 49%;
              @media (max-width: 600px) {
                grid-template-columns: 100%;
              }
            `}
          >
            {paperOrder.map((n: number) => acceptedPapers[n])}
          </div>
        </SubSection>

      </Section>
      <Section title="Sponsors">
        <p>The Embodied AI 2025 Workshop is sponsored by the following organizations:</p>
        <p>
          <center>
                <a href="https://logicalrobotics.com/">
              <img src="/images/sponsors/logical-robotics.png" height="150" alt="Logical Robotics"/>
            </a>

                <a href="https://microsoft.com/">
              <img src="/images/sponsors/microsoft-logo.png" height="300" alt="Microsoft"/>
            </a>
                <table>
              <tr>
                <td>
                  <center>

                <a href="https://www.projectaria.com/">
              <img src="/images/sponsors/project_aria.png" height="150" alt="Project Aria"/>
              <br></br>
              Project Aria
               </a>
               </center>
                </td>
              </tr>
            </table>
          </center>
        </p>
        </Section>
      <Section title="Organizers">
        The Embodied AI 2025 workshop is a joint effort by a large set of
        researchers from a variety of organizations. Each year, a set of
        lead organizers takes point coordinating with the CVPR conference,
        backed up by a large team of workshop organizers, challenge organizers,
        and scientific advisors.
        <SubSection title="Lead Organizers">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.cvpr2025.organizers
              .filter((organizer: any) => organizer.lo === true)
              .sort((a, b) => a.name.localeCompare(b.name))}
            data={data}
          />
        </SubSection>
        <SubSection title="Organizing Committee">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.cvpr2025.organizers
              .filter((organizer: any) => organizer.oc === true && organizer.lo === false)
              .sort((a, b) => a.name.localeCompare(b.name))}
            data={data}
          />
        </SubSection>
        <SubSection title="Challenge Organizers">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.cvpr2025.organizers
              .filter((organizer: any) => organizer.challenge === true)
              .sort((a, b) => a.name.localeCompare(b.name))}
            data={data}
          />
        </SubSection>
        <SubSection title="Scientific Advisory Board">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.cvpr2025.organizers
              .filter((organizer: any) => organizer.sab === true)
              .sort((a, b) => a.name.localeCompare(b.name))}
            data={data}
          />
        </SubSection>
      </Section>

        </PageWrapper>
    );     
}







// This helps the images load immediately, among other things
export const query = graphql`
  fragment VideoThumbnail on File {
    childImageSharp {
      fixed(width: 320, height: 180) {
        ...GatsbyImageSharpFixed
      }
    }
  }

  fragment FaceThumbnail on File {
    childImageSharp {
      fixed(width: 100, height: 100) {
        ...GatsbyImageSharpFixed
      }
    }
  }

  fragment FluidImage on File {
    childImageSharp {
      fluid(quality: 100) {
        ...GatsbyImageSharpFluid
      }
    }
  }

  query {
    # get data for each organizer from the siteMetadata
    allSite {
      nodes {
        siteMetadata {
          cvpr2025 {
            organizers {
              name
              imageId
              organization
              site
              sab
              oc
              lo
              challenge
            }
          }
        }
      }
    }

    # speaker pictures
    jitendra: file(relativePath: { eq: "cvpr2022/jitendra.jpg" }) {
      ...FaceThumbnail
    }
    roozbeh: file(relativePath: { eq: "cvpr2022/roozbeh.jpg" }) {
      ...FaceThumbnail
    }
    dhruv: file(relativePath: { eq: "cvpr2022/dhruv.jpg" }) {
      ...FaceThumbnail
    }
    katerina: file(relativePath: { eq: "cvpr2022/katerina.jpg" }) {
      ...FaceThumbnail
    }
    feifei: file(relativePath: { eq: "cvpr2022/fei-fei.jpg" }) {
      ...FaceThumbnail
    }
    carolina: file(relativePath: { eq: "cvpr2022/carolina.jpg" }) {
      ...FaceThumbnail
    }
    ichter: file(relativePath: { eq: "cvpr2024/brian_ichter.png" }) {
      ...FaceThumbnail
    }
    kembhavi: file(relativePath: { eq: "cvpr2024/ani_kembhavi.jpg" }) {
      ...FaceThumbnail
    }
    paxton: file(relativePath: { eq: "cvpr2024/chris_paxton.png" }) {
      ...FaceThumbnail
    }
    song: file(relativePath: { eq: "cvpr2024/shuran_song.jpg" }) {
      ...FaceThumbnail
    }
    jang: file(relativePath: { eq: "cvpr2024/eric_jang.jpg" }) {
      ...FaceThumbnail
    }
    aria: file(relativePath: { eq: "sponsors/project_aria.png" }) {
      ...FaceThumbnail
    }
    microsoft: file(relativePath: { eq: "sponsors/microsoft.png" }) {
      ...FaceThumbnail
    }

    anthony: file(relativePath: { eq: "organizers/anthony.jpg" }) {
      ...FaceThumbnail
    }
    jeannette: file(relativePath: { eq: "cvpr2023/jeannette.png" }) {
      ...FaceThumbnail
    }
    dieter: file(relativePath: { eq: "cvpr2023/dieter.jpg" }) {
      ...FaceThumbnail
    }
    ruslan: file(relativePath: { eq: "cvpr2023/ruslan.jpg" }) {
      ...FaceThumbnail
    }
    kristen: file(relativePath: { eq: "cvpr2023/kristen.jpg" }) {
      ...FaceThumbnail
    }
    saurabh: file(relativePath: { eq: "cvpr2023/saurabh.png" }) {
      ...FaceThumbnail
    }
    embodi: file(relativePath: { eq: "cvpr2023/embodi.png" }) {
      ...FaceThumbnail
    }
    claudia: file(relativePath: { eq: "organizers/claudia.jpg" }) {
      ...FaceThumbnail
    }
    fei: file(relativePath: { eq: "organizers/fei.jpg" }) {
      ...FaceThumbnail
    }
    
    # organizer pictures
    devendraOrg: file(relativePath: { eq: "organizers/devendra.jpg" }) {
      ...FluidImage
    }
    claudiaOrg: file(relativePath: { eq: "organizers/claudia.jpg" }) {
      ...FluidImage
    }
    anthonyOrg: file(relativePath: { eq: "organizers/anthony.jpg" }) {
      ...FluidImage
    }
    chengshuOrg: file(relativePath: { eq: "organizers/chengshu.jpg" }) {
      ...FluidImage
    }
    oleksandrOrg: file(relativePath: { eq: "organizers/oleksandr.jpg" }) {
      ...FluidImage
    }
    mikeOrg: file(relativePath: { eq: "organizers/mike.jpg" }) {
      ...FluidImage
    }
    andrewSOrg: file(relativePath: { eq: "organizers/andrewS.jpg" }) {
      ...FluidImage
    }
    lucaOrg: file(relativePath: { eq: "organizers/luca.jpg" }) {
      ...FluidImage
    }
    mattOrg: file(relativePath: { eq: "organizers/matt.jpg" }) {
      ...FluidImage
    }
    soreanOrg: file(relativePath: { eq: "organizers/sorean.jpg" }) {
      ...FluidImage
    }
    germanOrg: file(relativePath: { eq: "organizers/german.jpg" }) {
      ...FluidImage
    }
    joanneOrg: file(relativePath: { eq: "organizers/joanne.jpg" }) {
      ...FluidImage
    }
    joseMOrg: file(relativePath: { eq: "organizers/joseM.jpg" }) {
      ...FluidImage
    }
    soniaOrg: file(relativePath: { eq: "organizers/sonia.jpg" }) {
      ...FluidImage
    }
    aliOrg: file(relativePath: { eq: "organizers/ali.jpg" }) {
      ...FluidImage
    }
    joseAOrg: file(relativePath: { eq: "organizers/joseA.jpg" }) {
      ...FluidImage
    }
    aniOrg: file(relativePath: { eq: "organizers/ani.jpg" }) {
      ...FluidImage
    }
    feifeiOrg: file(relativePath: { eq: "organizers/feifei.jpg" }) {
      ...FluidImage
    }
    antonioOrg: file(relativePath: { eq: "organizers/antonio.jpg" }) {
      ...FluidImage
    }
    robertoOrg: file(relativePath: { eq: "organizers/roberto.jpg" }) {
      ...FluidImage
    }
    deviOrg: file(relativePath: { eq: "organizers/devi.jpg" }) {
      ...FluidImage
    }
    silvioOrg: file(relativePath: { eq: "organizers/silvio.jpg" }) {
      ...FluidImage
    }
    manolisOrg: file(relativePath: { eq: "organizers/manolis.jpg" }) {
      ...FluidImage
    }
    jieOrg: file(relativePath: { eq: "organizers/jie.jpg" }) {
      ...FluidImage
    }
    alexanderOrg: file(relativePath: { eq: "organizers/alexander.jpg" }) {
      ...FluidImage
    }
    feiOrg: file(relativePath: { eq: "organizers/fei.jpg" }) {
      ...FluidImage
    }
    karmeshOrg: file(relativePath: { eq: "organizers/karmesh.jpg" }) {
      ...FluidImage
    }
    aaronOrg: file(relativePath: { eq: "organizers/aaron.jpg" }) {
      ...FluidImage
    }
    rishabhOrg: file(relativePath: { eq: "organizers/rishabh.jpg" }) {
      ...FluidImage
    }
    ramOrg: file(relativePath: { eq: "organizers/ram.jpg" }) {
      ...FluidImage
    }
    santhoshOrg: file(relativePath: { eq: "organizers/santhosh.jpg" }) {
      ...FluidImage
    }
    erikOrg: file(relativePath: { eq: "organizers/erik.jpg" }) {
      ...FluidImage
    }
    ericUOrg: file(relativePath: { eq: "organizers/ericU.jpg" }) {
      ...FluidImage
    }
    alexanderCOrg: file(relativePath: { eq: "organizers/alexanderC.jpg" }) {
      ...FluidImage
    }
    dhruvOrg: file(relativePath: { eq: "organizers/dhruv.jpg" }) {
      ...FluidImage
    }
    unnatOrg: file(relativePath: { eq: "organizers/unnat.jpg" }) {
      ...FluidImage
    }
    ericOrg: file(relativePath: { eq: "organizers/eric.jpg" }) {
      ...FluidImage
    }
    roozbehOrg: file(relativePath: { eq: "organizers/roozbeh.jpg" }) {
      ...FluidImage
    }
    mohitOrg: file(relativePath: { eq: "organizers/mohit.png" }) {
      ...FluidImage
    }
    ishikaOrg: file(relativePath: { eq: "organizers/ishika.jpg" }) {
      ...FluidImage
    }
    anthonyLOrg: file(relativePath: { eq: "organizers/anthonyL.jpg" }) {
      ...FluidImage
    }
    tiffanyOrg: file(relativePath: { eq: "organizers/tiffany.jpg" }) {
      ...FluidImage
    }
    yonatanOrg: file(relativePath: { eq: "organizers/yonatan.jpg" }) {
      ...FluidImage
    }
    jesseOrg: file(relativePath: { eq: "organizers/jesse.jpg" }) {
      ...FluidImage
    }
    jacobOrg: file(relativePath: { eq: "organizers/jacob.jpg" }) {
      ...FluidImage
    }
    alexOrg: file(relativePath: { eq: "organizers/alex.jpg" }) {
      ...FluidImage
    }
    stefanOrg: file(relativePath: { eq: "organizers/stefan.jpg" }) {
      ...FluidImage
    }
    peterOrg: file(relativePath: { eq: "organizers/peter.jpg" }) {
      ...FluidImage
    }
    changanOrg: file(relativePath: { eq: "organizers/changan.jpg" }) {
      ...FluidImage
    }
    sagnikOrg: file(relativePath: { eq: "organizers/sagnik.jpg" }) {
      ...FluidImage
    }
    kristenOrg: file(relativePath: { eq: "organizers/kristen.jpg" }) {
      ...FluidImage
    }
    chuangOrg: file(relativePath: { eq: "organizers/chuang.jpg" }) {
      ...FluidImage
    }
    joshOrg: file(relativePath: { eq: "organizers/josh.jpg" }) {
      ...FluidImage
    }
    benOrg: file(relativePath: { eq: "organizers/ben.jpg" }) {
      ...FluidImage
    }
    angelOrg: file(relativePath: { eq: "organizers/angel.jpg" }) {
      ...FluidImage
    }
    soniaROrg: file(relativePath: { eq: "organizers/soniaR.jpg" }) {
      ...FluidImage
    }
    tommasoOrg: file(relativePath: { eq: "organizers/tommaso.jpg" }) {
      ...FluidImage
    }
    davidOrg: file(relativePath: { eq: "organizers/david.jpg" }) {
      ...FluidImage
    }
    nikoOrg: file(relativePath: { eq: "organizers/niko.jpg" }) {
      ...FluidImage
    }
    naokiOrg: file(relativePath: { eq: "organizers/naoki.jpg" }) {
      ...FluidImage
    }
    chrisOrg: file(relativePath: { eq: "organizers/chris.jpg" }) {
      ...FluidImage
    }
    davidHOrg: file(relativePath: { eq: "organizers/davidH.jpg" }) {
      ...FluidImage
    }
    devonOrg: file(relativePath: { eq: "organizers/devon.jpg" }) {
      ...FluidImage
    }
    lambertoOrg: file(relativePath: { eq: "organizers/lamberto.jpg" }) {
      ...FluidImage
    }
    xiaofengOrg: file(relativePath: { eq: "organizers/xiaofeng.jpg" }) {
      ...FluidImage
    }
    govindOrg: file(relativePath: { eq: "organizers/govind.jpg" }) {
      ...FluidImage
    }
    ruohanOrg: file(relativePath: { eq: "organizers/ruohan.jpg" }) {
      ...FluidImage
    }
    stoneOrg: file(relativePath: { eq: "organizers/stone.jpg" }) {
      ...FluidImage
    }
    fanboOrg: file(relativePath: { eq: "organizers/fanbo.png" }) {
      ...FluidImage
    }
    jiayuanOrg: file(relativePath: { eq: "organizers/jiayuan.png" }) {
      ...FluidImage
    }
    rinOrg: file(relativePath: { eq: "organizers/rin.jpg" }) {
      ...FluidImage
    }
    ranGongOrg: file(relativePath: { eq: "organizers/Ran_Gong.png" }) {
      ...FluidImage
    }
    siyuanHuangOrg: file(relativePath: { eq: "organizers/Siyuan_Huang.png" }) {
      ...FluidImage
    }
    jiangyongHuangOrg: file(relativePath: { eq: "organizers/Jiangyong_Huang.png" }) {
      ...FluidImage
    }
    baoxiongJiaOrg: file(relativePath: { eq: "organizers/Baoxiong_Jia.png" }) {
      ...FluidImage
    }
    andreyKolobovOrg: file(relativePath: { eq: "organizers/andrey-kolobov.png" }) {
      ...FluidImage
    }
    adeFamotiOrg: file(relativePath: { eq: "organizers/ade-famoti.png" }) {
      ...FluidImage
    }
    zhuoqunXuOrg: file(relativePath: { eq: "organizers/zhuoqun-xu.png" }) {
      ...FluidImage
    }
    haoDongOrg: file(relativePath: { eq: "organizers/hao-dong.png" }) {
      ...FluidImage
    }
    richardHeBaiOrg: file(relativePath: { eq: "organizers/richard-he-bai.jpg" }) {
      ...FluidImage
    }
    yangLiuOrg: file(relativePath: { eq: "organizers/yang-liu.jpg" }) {
      ...FluidImage
    }
    joelJangOrg: file(relativePath: { eq: "organizers/joel-jang.jpg" }) {
      ...FluidImage
    }
    geordieRose: file(relativePath: { eq: "cvpr2024/geordieRose.png" }) {
      ...FaceThumbnail
    }
    ashleyLlorens: file(relativePath: { eq: "cvpr2024/ashleyLlorens.png" }) {
      ...FaceThumbnail
    }
    stevieBathiche: file(relativePath: { eq: "cvpr2024/stevieBathiche.png" }) {
      ...FaceThumbnail
    }
    andreyKolobov: file(relativePath: { eq: "organizers/andrey-kolobov.png" }) {
      ...FaceThumbnail
    }
    adeFamoti: file(relativePath: { eq: "organizers/ade-famoti.png" }) {
      ...FaceThumbnail
    }
    oliviaNorton: file(relativePath: { eq: "cvpr2024/olivia-norton.jpg" }) {
      ...FaceThumbnail
    }
    richardNewcombe: file(relativePath: { eq: "cvpr2024/richard-newcombe.jpg" }) {
      ...FaceThumbnail
    }
    unknownOrg: file(relativePath: { eq: "organizers/unknown.png" }) {
      ...FluidImage
    }
    vivanOrg: file(relativePath: { eq: "organizers/Vivan-Amin.jpg" }) {
      ...FluidImage
    }
    rachithOrg: file(relativePath: { eq: "organizers/rachith-prakash.png" }) {
      ...FluidImage
    }
    jiaolongOrg: file(relativePath: { eq: "organizers/jiaolong-yang.jpg" }) {
      ...FluidImage
    }
    minyoungOrg: file(relativePath: { eq: "organizers/minyoung-hwang.png" }) {
      ...FluidImage
    }
    larsOrg: file(relativePath: { eq: "organizers/Lars_Johannsmeier.jpg" }) {
      ...FluidImage
    }
    cemOrg: file(relativePath: { eq: "organizers/cem-gokmen.jpg" }) {
      ...FluidImage
    }
    
    # Other pictures
    ariaDemo: file(relativePath: { eq: "cvpr2024/aria-demo.jpg" }) {
      ...FluidImage
    }
    workshopLocation: file(relativePath: { eq: "cvpr2024/workshop-location.png" }) {
      ...FluidImage
    }
  }
`;
