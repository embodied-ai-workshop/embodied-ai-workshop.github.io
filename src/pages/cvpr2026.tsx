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
  ManiSkillViTac: (
    <a href="https://callmeray.github.io/Mani_ViTac_Challenge_2026_page/" target="_blank">
      ManiSkill-ViTac
    </a>
  ),
  ManipArena: (
    <a href="https://maniparena.x2robot.com/" target="_blank">
      ManipArena
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

function PaperButton(props: { text: string; url: string; }) {
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
        <PaperButton text="PDF" url={props.pdf} />
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

let acceptedPapers = [
  <Paper
    title="Counterfactual Simulation for Embodied LLM Planning"
    abstract="Large language model–guided embodied agents often rely on greedy action prediction, leading to collisions and suboptimal performance in cluttered environments. We introduce a \textbf{counterfactual simulation} framework in which agents generate multiple hypothetical action sequences, simulate their outcomes, and score them using lightweight heuristics to select the most promising sequence. Experiments in AI2-THOR navigation tasks (200 episodes, 30 scenes, 15 object categories) show that counterfactual reasoning reduces collisions by 28.4\% and improves goal completion by 11.2\% compared to greedy planning, with statistical significance at $p<0.01$."
    authors={{
    "Mahule Roy":[],
    "Subhas Roy":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/1_Counterfactual_Simulation_fo.pdf"
    />,
  <Paper
    title="Humanoid Everyday: A Comprehensive Robotic Dataset for Open-World Humanoid Manipulation"
    abstract="From loco-motion to dextrous manipulation, humanoid robots have made remarkable strides in demonstrating complex full-body capabilities. However, the majority of current robot learning datasets and benchmarks mainly focus on stationary robot arms, and the few existing humanoid datasets are either confined to fixed environments or limited in task diversity, often lacking human-humanoid interaction and lower-body locomotion. Moreover, there are a few standardized evaluation platforms for benchmarking learning-based policies on humanoid data. In this work, we present Humanoid Everyday, a large-scale and diverse humanoid manipulation dataset characterized by extensive task variety involving dextrous object manipulation, human-humanoid interaction, locomotion-integrated actions, and more. Leveraging a highly efficient human-supervised teleoperation pipeline, Humanoid Everyday aggregates high-quality multimodal sensory data, including RGB, depth, LiDAR, and tactile inputs, together with natural language annotations, comprising 10.3k trajectories and over 3 million frames of data across 260 tasks across 7 broad categories. In addition, we conduct an analysis of representative policy learning methods on our dataset, providing insights into their strengths and limitations across different task categories. For standardized evaluation, we introduce a cloud-based evaluation platform that allows researchers to seamlessly deploy their policies in our controlled setting and receive performance feedback. By releasing Humanoid Everyday along with our policy learning analysis and a standardized cloud-based evaluation platform, we intend to advance research in general-purpose humanoid manipulation and lay the groundwork for more capable and embodied robotic agents in real-world scenarios. Our dataset, data collection code, and cloud evaluation website are made publicly available on our project website."
    authors={{
    "Zhenyu Zhao":[],
    "Hongyi Jing":[],
    "Xiawei Liu":[],
    "Jiageng Mao":[],
    "Abha Jha":[],
    "Hanwen Yang":[],
    "Rong Xue":[],
    "Sergey Zakharov":[],
    "Vitor Campagnolo Guizilini":[],
    "Yue Wang":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/3_Humanoid_Everyday_A_Comprehe.pdf"
    />,
  <Paper
    title="Physics-Steerable Video World Models for Embodied Scenario Generation"
    abstract="Embodied agents need world models that can generate physically varied scenarios on demand, without retraining. Recent work shows that physical plausibility is linearly encoded in a frozen VideoMAE encoder at a consistent depth region called the Physics Emergence Zone (PEZ), and that Concept Activation Vectors (CAVs) can steer this representation at inference time. We extend this foundation toward a fully controllable video world model with three new primitives: pixel-space scenario output by coupling PEZ-layer steering to VideoMAE's MAE decoder, compositional control of physics and motion independently (CAV angle 86.6°, interaction norm ≤ 0.42), and temporal scheduling of physical violations across the video. A key finding is that physics is encoded uniformly across all temporal positions in VideoMAE, meaning fine-grained temporal control requires architectural changes beyond joint space-time attention. Together, these primitives enable stress-testing of embodied agents against out-of-distribution physical scenarios with no new data or retraining."
    authors={{
    "Nahid Alam":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/4_Physics_Steerable_Video_Worl.pdf"
    />,
  <Paper
    title="Event-Driven Embodied Perception for Hazardous Slip Detection under Perceptual Degradation"
    abstract="Embodied robots operating on planetary surfaces must preserve mobility when visual perception is degraded by low-angle illumination, shadowing, dust, and weak terrain texture. Under these conditions, vision-dominant traversability assessment can become unreliable, while continuous dense fusion is costly for power-limited rovers. We present an event-driven multi-modal perception framework for hazardous wheel slip detection using Spiking Neural Networks (SNNs). Exteroceptive visual observations and proprioceptive IMU and motor-current streams are encoded with Bayesian Spike Pattern Superposition (BSPS), producing an asynchronous representation that remains stable under visual noise, dropout, and temporal jitter. The detector is evaluated in a high-fidelity lunar surface simulation with Bekker-Wong terramechanics, controlled visual degradation, and simulator-derived wheel-terrain ground truth. It detects hazardous slip events with an F1-score of $0.86 \pm 0.04$. Deployed on the BrainChip Akida neuromorphic processor, the model achieves $1.2$ ms latency and $48,\mu J$ per inference. These results show that event-driven embodied perception can retain slip awareness under degraded vision while remaining compatible with planetary SWaP constraints."
    authors={{
    "Sylvester Kaczmarek":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/5_Event_Driven_Embodied_Percep.pdf"
    />,
  <Paper
    title="FailGen: Frontier-Aware Semantic Data Synthesis for Embodied Manipulation"
    abstract="Scaling up robot learning requires massive datasets that cover diverse physical interactions and semantic scenarios. While recent advances in generative models allow for synthesizing tasks and environments, and trajectory optimization enables data expansion from demonstrations, current approaches treat these as separate pipelines. This disconnect leads to a critical inefficiency: generated environments often lack physical feasibility for the robot, or fail to target the specific weaknesses of the current policy, resulting in data that is either trivial or impossible."
    authors={{
    "Zhirui Hu":[],
    "Sen Cui":[],
    "Jialin Tang":[],
    "Jingheng Ma":[],
    "Changshui Zhang":[],
    "Shiji Zhou":[],
    "Xiao Zhang":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/6_FailGen_Frontier_Aware_Seman.pdf"
    />,
  <Paper
    title="EPM: Episodic Predictive Memory as a Latent World Model for Season-Invariant Visual Place Recognition"
    abstract="A robot following a familiar outdoor route faces two opposite difficulties: the same place can look very different across snow, rain and so on, while distant road segments may look nearly identical. Single-image VPR descriptors can struggle because appearance changes or repeated route geometry create different kinds of ambiguity. We propose EPM (Episodic Predictive Memory), a lightweight route memory model for few-shot cross-season VPR. It combines local VLAD features, recurrent route context, and FAISS episodic retrieval. On Boreas cross-season pairs, EPM reaches 89.9% SR@25m at 538 FPS with 12.7M parameters, outperforming CosPlace by 7.7 pp and reducing per-pair variance by 6x. Frozen-representation probing shows that EPM states are more predictable under egomotion than strong visual baselines. The results suggest that EPM learns a structured latent route state, offering a lightweight bridge between episodic route memory and latent world-model ideas."
    authors={{
    "Jiaxin Li":[],
    "Chen Sun":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/7_EPM_Episodic_Predictive_Memo.pdf"
    />,
  <Paper
    title="HoMMI: Learning Whole-Body Mobile Manipulation from Human Demonstrations"
    abstract="We present Whole-Body Mobile Manipulation Interface (HoMMI), a data collection and policy learning framework that learns whole-body mobile manipulation directly from robot-free human demonstrations. We augment UMI interfaces with egocentric sensing to capture the global context required for mobile manipulation, enabling portable, robot-free, and scalable data collection. However, naively incorporating egocentric sensing introduces a larger human-to-robot embodiment gap in both observation and action spaces, making policy transfer difficult. We explicitly bridge this gap with a cross-embodiment hand-eye policy design, including an embodiment agnostic visual representation; a relaxed head action representation; and a whole-body controller that realizes hand-eye trajectories through coordinated whole-body motion under robot-specific physical constraints. Together, these enable long-horizon mobile manipulation tasks requiring bimanual and whole-body coordination, navigation, and active perception. Project website: https://hommi-robot.github.io"
    authors={{
    "Xiaomeng Xu":[],
    "Jisang Park":[],
    "Han Zhang":[],
    "Eric Cousineau":[],
    "Aditya Bhat":[],
    "Jose Barreiros":[],
    "Dian Wang":[],
    "Jeannette Bohg":[],
    "Shuran Song":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/8_HoMMI_Learning_Whole_Body_Mo.pdf"
    />,
  <Paper
    title="EmbodiedRec: Preference-Grounded World Models for Spatially-Aware Recommendation"
    abstract="Recommendation systems traditionally operate in abstract latent spaces, divorced from the physical contexts in which users make decisions. We propose EmbodiedRec, a framework that equips an embodied agent with a Preference World Model (PWM): a structured representation that jointly captures physical scene dynamics and user preference distributions conditioned on spatial context. Rather than treating recommendation as a static lookup over interaction histories, EmbodiedRec frames it as an active navigation problem: the agent perceives its environment, maintains a spatially-evolving preference belief, and issues contextually grounded suggestions: what activity to pursue, what content to engage with, what next action to take: based on where it is and what it observes. As a preliminary validation, we augment MovieLens-100K with simulated spatial context and show that even a simple context-aware model outperforms context-free BPR by +5.0% NDCG@10 and raises Spatial Preference Correlation from near-zero to 0.393, motivating the full embodied framework."
    authors={{
    "Aastha Valecha":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/11_EmbodiedRec_Preference_Grou.pdf"
    />,
  <Paper
    title="CLEAR: Closed-Loop Reinforcement Learning at Scale for End-to-End Autonomous Driving"
    abstract="Existing VLA-based policies for E2E-AD largely adopts imitation learning (IL) as the primary approach, i.e., the learning objective typically is only to optimize certain distance metrics (e.g., L2 error) w.r.t. ground-truth expert trajectories. However, the distribution shift between open-loop training and closed-loop inference often leads to compromised policies, exhibiting suboptimal performance in closed-loop planning. To address this, we propose CLEAR, a system that effectively enables and efficiently performs closed-loop RL finetuning of VLA policies for E2E-AD. We first pretrain CLEAR on a large set of expert trajectories using imitation learning, equipping it with baseline driving capabilities. Then, we freeze the VLA agent except the action head, which outputs driving actions, on top of which we finetune with Proximal Policy Optimization (PPO). We also design a novel heterogeneous finetuning pipeline with which we're able to dramatically scale up the number of parallel simulator environments and PPO updates, which lead to superior results."
    authors={{
    "Yunxiao Shi":[],
    "Hong Cai":[],
    "Mohammad Ghavamzadeh":[],
    "Fatih Porikli":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/12_CLEAR_Closed_Loop_Reinforce.pdf"
    />,
  <Paper
    title="Emotion-Conditioned Short-Horizon Human Pose Forecasting with a Lightweight Predictive World Model"
    abstract="Emotional signals critically influence human motion but are often overlooked in pose prediction. We propose a lightweight, autoregressive world model that integrates facial emotion embeddings with pose keypoints via a learnable gating mechanism[1-5]. Using a two-layer LSTM, our model performs 15-step rolling prediction. Experiments on controlled and naturalistic datasets show that normalized gating significantly improves accuracy in emotion-driven sequences. Counterfactual perturbations further prove that emotion embeddings serve as causal conditional signals, directly shifting predicted trajectories. This demonstrates the feasibility of emotion-conditioned world models for human-centric embodied AI."
    authors={{
    "Jingni Huang":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/13_Emotion_Conditioned_Short_H.pdf"
    />,
  <Paper
    title="Keep the Flow: Continuous High-Precision Bimanual Manipulation in Constrained Spaces"
    abstract="Recent robotic datasets have scaled generalist policies, but most lack strict metric constraints for precise object placement. To address this, we introduce Keep the Flow, a real-world bimanual humanoid dataset explicitly designed for spatially constrained manipulation. We collect these demonstrations via VR teleoperation on a Unitree G1 humanoid equipped with three-fingered Dex3-1 hands, covering both Single-row and Multi-row task formations. To ensure high-precision annotations, an automated overhead RGB-D verification loop filters out demonstrations whose final placement error exceeds 2cm. Furthermore, we develop an action-state-preserving visual augmentation pipeline that combines SAM2-based object recoloring with workspace grid removal."
    authors={{
    "Hojae Jeong":[],
    "JuHyoung Lee":[],
    "Eunwoo Song":[],
    "Jaerim Kim":[],
    "Heewon Kim":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/14_Keep_the_Flow_Continuous_Hi.pdf"
    />,
  <Paper
    title="Simulation as Spatial Imagination for Embodied Visual Reasoning"
    abstract="Vision-language models (VLMs) enable embodied agents to interpret natural language instructions and reason about visual scenes, but often produce actions that are semantically plausible yet physically infeasible. We propose a hybrid framework that combines retrieval of structured physical constraints with physics-based simulation, treating simulation as spatial imagination for pre-execution feasibility verification. Given an image and instruction, the system retrieves task-relevant feasibility rules and validates candidate actions in simulation to assess geometric and kinematic consistency. We evaluate on tabletop manipulation tasks involving containment, stability, occlusion, and reachability. Simulation significantly reduces false-positive feasibility predictions compared to language-only and retrieval-augmented baselines."
    authors={{
    "Kornelia Skorupińska":[],
    "Rafal Staszak":[],
    "Mikołaj Zieliński":[],
    "Dominik Belter":[],
    "Piotr Skrzypczynski":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/15_Simulation_as_Spatial_Imagi.pdf"
    />,
  <Paper
    title="PhysFlow: Physics-Grounded Visual World Models via Flow Matching and Lagrangian Neural Networks"
    abstract="Learning predictive world models for visual robotics requires coupling high-dimensional visual perception with physically plausible dynamics. We present PhysFlow, a hybrid world model that integrates three core components: a frozen DINOv2 ViT encoder for robust visual feature extraction; a conditional flow-matching network that estimates residual external generalized forces; and a Lagrangian Neural Network that enforces energy-based forward dynamics with a guaranteed positive-definite mass matrix. A key challenge in training such hybrid systems is numerical instability arising from the circular dependency between the force estimator and the physics solver. We mitigate this through a staged pretraining protocol and a softplus-constrained Cholesky parameterization of the mass matrix. On the DeepMind Control Suite Hopper task, our model achieves a 93 % reduction in one-step visual latent prediction error, outperforms identity baselines at 10-step horizons, and maintains bounded state-space predictions across 50-step horizons where alternative neural approaches often diverge."
    authors={{
    "Prakrut Kotecha":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/16_PhysFlow_Physics_Grounded_V.pdf"
    />,
  <Paper
    title="Reading Between the Lines: Teaching Open-Source Embodied Agents to Resolve Vague Human Instructions"
    abstract="Open-source large language models (LLMs) suffer from catastrophic performance collapse (19–58% success rate) when faced with ambiguous, human-like instructions characterized by implicit pronouns and noisy dialogue. To bridge this gap, we introduce FAST-PLAN, a scalable, annotation-free framework that synthesizes training data by identifying and refining a model’s own planning failures. By fine-tuning open source backbones (Llama-3.2-Inst., Qwen-3-4B-Inst.) on these 1.8K failure-driven trajectories, we achieve a +50 to +80 percentage points success rate increase on REI-Bench and demonstrate zero-shot generalization to the CLARA (+6.14 F1) and AmbiK, two out-of-distribution embodied ambiguity benchmarks."
    authors={{
    "Souradeep Mukhopadhyay":[],
    "Vedang Vasant Avaghade":[],
    "Ali Payani":[],
    "Gaowen Liu":[],
    "Jayanth Srinivasa":[],
    "Chitta Baral":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/17_Reading_Between_the_Lines_T.pdf"
    />,
  <Paper
    title="Learning Visual Feature-Based World Models via Residual Latent Action"
    abstract="World models predict future transitions from observations and actions. Existing works predominantly focus on image generation only. Visual feature-based world models, on the other hand, predict future visual features instead of raw video pixels, offering a promising alternative that is more efficient and less prone to hallucination. However, current feature-based approaches rely on direct regression, which leads to blurry or collapsed predictions in complex interactions, while generative modeling in high-dimensional feature spaces still remains challenging. In this work, we discover that a new type of latent action representation, which we refer to as *Residual Latent Action* (RLA), can be easily learned from DINO residuals. We also show that RLA is predictive, generalizable, and encodes temporal progression. Building on RLA, we propose *RLA World Model* (RLA-WM), which predicts RLA values via flow matching. RLA-WM outperforms both state-of-the-art feature-based and video-diffusion world models on simulation and real-world datasets, while being orders of magnitude faster than video diffusion. Furthermore, we develop two robot learning techniques that use RLA-WM to improve policy learning. The first one is a minimalist world action model with RLA that learns from actionless demonstration videos. The second one is the first visual RL framework trained entirely inside a world model learned from offline videos only, using a video-aligned reward and no online interactions or handcrafted rewards."
    authors={{
    "Xinyu Zhang":[],
    "Zhengtong Xu":[],
    "Yutian Tao":[],
    "Yeping Wang":[],
    "Yu She":[],
    "Abdeslam Boularias":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/18_Learning_Visual_Feature_Bas.pdf"
    />,
  <Paper
    title="AB-DualVLA: Task-Routed Cloud–Edge Vision–Language–Action Policies"
    abstract="We study how cloud-side and edge-side VLAs can be organized into a task-routed manipulation system. AB-DualVLA (Attention-Bottleneck DualVLA) keeps Pi0 and SmolVLA frozen, trains a token-level fusion student path over extracted intermediate tokens, and selects among paths at the task level. On LIBERO-Object (10 tasks) the system reaches 89.5% closed-loop success at 10 episodes per task per seed, averaged over multiple seeds. The 79M student attains low open-loop fit, but this does not transfer to standalone closed-loop performance; the student is therefore used as one of the routed paths rather than a replacement for either backbone. We report the experimental results in open-loop fit, latency, and fallback behavior metrics."
    authors={{
    "Yuhe Wen":[],
    "Jaeho Jung":[],
    "Quan Gan":[],
    "Jehwan Choi":[],
    "Duy-Linh Nguyen":[],
    "Kang-Hyun Jo":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/19_AB_DualVLA_Task_Routed_Clou.pdf"
    />,
  <Paper
    title="Test-Time Scaling for World Action Models via Zero-Shot Geometric Verification"
    abstract="World Action Models (WAMs) jointly predict future video frames and actions from multi-view observations, but their generations can contain geometrically implausible scenes, degrading action quality. For WAMs, on-the-fly rollout selection often relies on model-specific value heads, limiting cross-model reuse. To address this, we propose a training-free, model-agnostic rollout verifier that repurposes VGGT as a frozen geometric evaluator. It scores WAM rollouts using a cross-view depth reprojection consistency error and selects the most geometrically plausible candidate via Best-of-N test-time scaling. Our key insight is that if a world model faithfully captures 3D structure, its multi-view predictions must be geometrically consistent; violations can indicate hallucination. On RoboCasa with Cosmos Policy, our verifier achieves an AUROC of 0.736 for single-step failure detection, substantially outperforming the co-trained value head. Consequently, our test-time scaling improves overall task success rates across various benchmarks and WAM baselines."
    authors={{
    "Zesen Zhao":[],
    "Minkyoung Cho":[],
    "Hui Shen":[],
    "Boyuan Zheng":[],
    "Kunxiao Gao":[],
    "Yulong Cao":[],
    "Zhuoqing Mao":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/20_Test_Time_Scaling_for_World.pdf"
    />,
  <Paper
    title="SeedWorld: Generative Simulation Automation for Compositional Robotic Skill Generalization via Seed Demonstrations"
    abstract="Simulation is an important paradigm for training robots on diverse tasks. However, building useful simulation tasks still requires substantial human effort, such as teleoperation. Existing data generation paradigms face a dilemma: augmentation methods based on static datasets are limited by the semantic boundaries of the original data, while unconstrained generative exploration often suffers from low efficiency. We propose SeedWorld, a multi-agent simulation framework that expands a single human demonstration into composable simulation tasks for robot skill learning (Fig.1). SeedWorld coordinates task-proposal, task-construction, skill-learning, and feedback agents to generate related task variants, instantiate executable compositional tasks, train robot skills, and improve low-success tasks. Experiments show that SeedWorld generates diverse and physically plausible tasks from very few seeds, enabling compositional skill generalization across different scenes with minimal human input."
    authors={{
    "Jialin Tang":[],
    "Sen Cui":[],
    "Zhirui Hu":[],
    "Tianyuan Chen":[],
    "Bangde Cao":[],
    "Jingheng Ma":[],
    "Changshui Zhang":[],
    "Shiji Zhou":[],
    "Xiao Zhang":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/21_SeedWorld_Generative_Simula.pdf"
    />,
  <Paper
    title="Do VLMs Know What to Do After Failed Actions? A Diagnostic Probe for Embodied Error Recovery"
    abstract="Embodied agents must not only execute instructions, but also recover after failed actions. We study whether vision-language models (VLMs) can diagnose what went wrong and choose the next corrective action under ambiguous before--after visual evidence. We introduce a compact AI2-THOR-based diagnostic probe of 240 manually constructed and audited post-failure examples across four failure mechanisms: wrong view, wrong object or unrelated action, unsatisfied precondition/order, and task-appropriate but ineffective execution. Each example requires two outputs: a failure category and a one-step recovery action. We evaluate three hosted VLM endpoints under four input conditions: full before--after context, after-only context, text-only context, and a temporal swap-test. The results reveal three diagnostic effects. First, models exhibit a diagnosis--action gap: failure-category prediction is often easier than recovery-action selection. Second, text-only performance exposes language-prior shortcuts in some wrong-object cases. Third, temporal swapping sharply degrades wrong-object recovery, showing that temporal direction matters for embodied error recovery."
    authors={{
    "Tianxin Huang":[],
    "Jinrui Mai":[],
    "Jiayu Chen":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/22_Do_VLMs_Know_What_to_Do_Aft.pdf"
    />,
  <Paper
    title="Fine-tuning Robotic Foundation Model Using Dynamic Scene Generation"
    abstract="Continuous-state robotic manipulation requires an agent to interpret language goals, estimate object states, and execute physically valid actions toward fine-grained targets. However, training data for such tasks is sparse: collecting demonstrations for every object, scene, and target state is expensive, and synthetic data is useful only when it remains executable. In this paper, we summarize our two-year participation in the ARNOLD Challenge, hosted as part of the CVPR Embodied AI Workshop~\cite{embodiedai2026}. In this paper, we present the methods developed for the ARNOLD Challenge on continuous-state robotic manipulation. \textbf{PSASI} densifies supervision over continuous object states through state interpolation and phase-specific control. \textbf{FRFM} further expands the training distribution with physics-verified dynamic scene generation for foundation-model fine-tuning. Our key insight is that performance improves not merely by increasing data volume, but by expanding the training distribution in a manipulation-aware way: separating action phases, interpolating continuous states, and generating executable scenes for foundation-model fine-tuning."
    authors={{
    "Sungyong Park":[],
    "Sangmin Lee":[],
    "Dowon Kim":[],
    "Heewon Kim":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/23_Fine_tuning_Robotic_Foundat.pdf"
    />,
  <Paper
    title="Agentic Decomposition for Reasoning-Oriented Real-World Robot Manipulation"
    abstract="Generalist vision-language-action (VLA) models provide strong visuomotor priors, but reasoning-oriented robot manipulation also requires task interpretation, scene grounding, atomic skill decomposition, progress monitoring, and recovery. We introduce AgentVLA, an agentic task interface that treats a VLA model as a reusable low-level executor inside a tool-augmented robot system. AgentVLA converts multi-view observations and task instructions into scene-grounded atomic-skill context, invokes tools for grounding and diagnosis, and conditions the executor on explicit task-stage information while keeping the robot-control protocol unchanged. We validate this design on the ManipArena Challenge at the CVPR 2026 Embodied AI Workshop, where our system achieved the highest success rate in the preliminary evaluation across five bimanual manipulation tasks. Our analysis further shows that noisy demonstrations can teach premature task completion, while spatial-layout shifts can induce brittle geometric priors. These failures motivate separating task reasoning from low-level action generation by atomizing long-horizon tasks into grounded, reusable, and verifiable skill primitives around a shared VLA executor."
    authors={{
    "Yutong Lin":[],
    "Zhenxuan Fan":[],
    "Yuqian Yuan":[],
    "Wentong Li":[],
    "Wenqiao Zhang":[],
    "Changxu Cheng":[],
    "Tao Wang":[],
    "Juncheng Li":[],
    "Jun Xiao":[],
    "Siliang Tang":[],
    "Yueting Zhuang":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/24_Agentic_Decomposition_for_R.pdf"
    />,
  <Paper
    title="Towards Thermal-Aware Humanoid Locomotion: Estimating Unobserved Winding Temperatures"
    abstract="Sustained humanoid locomotion is bounded by progressive torque degradation from motor heating, and failure is driven by the unobservable winding temperature rather than the measurable housing. First-order models cannot represent the winding state, while standard second-order LPTNs assume embedded winding sensors and treat each actuator in isolation—both invalid on humanoid servo-integrated actuators. We adapt the coupled second-order LPTN with physically-informed regularizers derived from non-destructive teardown of commercial servos and an inter-motor coupling term for shared housings and PLA-frame conduction, identified from only the integer-quantized housing temperature. On the ToddlerBot platform with 30 actuators, the identified model recovers the unobserved winding state with physically consistent behavior, providing a foundation for thermal-aware locomotion policies."
    authors={{
    "Eunwoo Song":[],
    "Sangmin Lee":[],
    "Yeonji Kim":[],
    "Heewon Kim":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/25_Towards_Thermal_Aware_Human.pdf"
    />,
  <Paper
    title="SO-101 Bench: Measuring the Gap Between Semantic and Geometric Competence in Vision-Language-Action Models"
    abstract="Vision-language-action (VLA) models have become increasingly effective general-purpose robot policies, but it remains unclear how well their semantic competence transfers to precise geometric manipulation under novel objects and embodiments. We present SO-101 Bench, a compact benchmark for language-conditioned tabletop manipulation with an SO-101 arm. The benchmark evaluates four tasks across 56 household objects spanning seen, unseen/seen-class, and unseen/unseen-class regimes. We collect over 4,000 teleoperated demonstrations (roughly 20 hours), fine-tune GR00T-N1.6-3B, and evaluate the resulting policy in the real world. While the policy reaches 97.4% success on the simplest one-object bin task, performance degrades sharply under spatial constraints, clutter, and novelty, falling to 6.5% on the four-object bin task and 6.3\% on the between task for fully unseen objects. Failure analysis suggests the main bottleneck is not instruction grounding, but geometric execution: imprecise grasps, poor grasp strategies for unfamiliar shapes, weak recovery, and fragile spatial composition. We also preview the benchmark’s Isaac Lab extension for scalable real-to-sim evaluation."
    authors={{
    "Truman Hickok":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/26_SO_101_Bench_Measuring_the_.pdf"
    />,
  <Paper
    title="PRISM-World: Teaching Video World Models the Physics of Retail Environments"
    abstract="Text-conditioned video diffusion models such as Cosmos-Predict2 act as world models capable of rolling out plausible future frames from a single observation, but they are trained on broad internet video and lack the domain priors required for embodied retail settings—structured shelves, dense shopper traffic, and the rigid-object physics that govern carts, baskets, and produce crates. We address this gap on two fronts. (i) PRISM-World, a curated exo-centric retail-video dataset of 15,115 atomic-action-captioned 5.8 s clips derived from 1,093 multi-camera 4K recordings (≈437 h) of five retail stores, with trajectory and atomic-action labels auto-generated by a large vision-language model. (ii) A LoRA recipe that adapts Cosmos-Predict2-2B-Video2World to PRISM-World by training only ≈7 M parameters (0.35% of the 2 B-parameter DiT) for ∼3.6 h on 8×H100. On the full 757-clip held-out test split the adapted model reduces Fréchet Video Distance from 11.91 to 8.98 (-24.6%) and LPIPS by -12.2 to -19.1% at horizons from 0.5 to 5.5 s. Qualitatively, the adapted rollouts execute the prompted action, preserve actor identity, and respect fixed-camera continuity and basic object physics that the unadapted baseline violates."
    authors={{
    "Amirreza Rouhi":[],
    "Rajat Aggarwal":[],
    "Parikshit Sakurikar":[],
    "Anoop M. Namboodiri":[],
    "Sashi P Reddi":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/27_PRISM_World_Teaching_Video_.pdf"
    />,
  <Paper
    title="Trajectory-aware Success and Failure Experience Retrieval for VLM Agent"
    abstract="Vision-language models have recently been used as embodied agents for zero-shot task execution, but they still struggle to reuse past experiences in unseen environments. Existing memory-based methods often retrieve experiences using task instructions, which may not reflect the agent’s current execution trajectory during replanning. To address this, we propose Trajectory-aware Experience Retrieval for VLM Agents, which summarizes text- and image-grounded success/failure experiences into generalized rules and retrieves trajectory-relevant rules during replanning. TERA incorporates these rules into the VLM prompt, using diverse, unpaired success and failure experiences as structural guidance and to avoid repeated mistakes. On EmbodiedBench’s EB-Manipulation and EB-Habitat, TERA improves performance by up to 10.4% and 14.0%, respectively, demonstrating the complementary benefit of success and failure experiences."
    authors={{
    "Somin Lee":[],
    "Jinsik Bang":[],
    "Taehwan Kim":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/28_Trajectory_aware_Success_an.pdf"
    />,
  <Paper
    title="Improving VLA Workspace Randomization Robustness for Industrial Pick-and-Place via Lightweight Residual Reinforcement Learning"
    abstract="Vision-language-action (VLA) models have recently demonstrated strong generalization across robotic manipulation tasks. However, many VLAs remain brittle to variations in initial workspace configurations, limiting their applicability in industrial settings. We investigate improving VLA robustness for industrial pick-and-place using lightweight residual reinforcement learning (RL). Instead of finetuning the base VLA, we learn a small residual multi-layer perceptron (MLP) policy that edits actions generated by a frozen VLA policy. We further investigate several design choices for stable residual learning, including curriculum-based domain randomization, network initialization, reward structure, and residual observation spaces. Using a representative industrial pipe sorting task in IsaacLab with the GR00T N1 VLA, we demonstrate that residual RL substantially improves robustness and behavioral diversity under increasing workspace randomization while requiring only a fractional increase in parameter count."
    authors={{
    "Siva Kailas":[],
    "Shalin Jain":[],
    "Harish Ravichandar":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/29_Improving_VLA_Workspace_Ran.pdf"
    />,
  <Paper
    title="Efficient Sim-to-Real Transfer of World-Action Models from Synthetic Priors"
    abstract="Bridging the sim-to-real gap is a core challenge in deploying learned manipulation policies. World-action models show remarkable ability in modeling environment dynamics. These models jointly predict future visual observations and robot actions within a unified generative framework. We argue this modeling capability is essential for effective sim-to-real transfer. To demonstrate this, we build upon Cosmos Policy, a video diffusion model adapted for visuomotor control. We construct simulation environments with extensive domain randomization, whereas demonstrations are then generated using the AnyTask motion planning pipeline. We evaluate our approach across object lifting, drawer opening, and pick-and-place tasks using only about 800 synthetic demonstrations per task. Ultimately, our policy achieves zero-shot RGB sim-to-real transfer on a Franka Research 3, attaining a 35\% average success rate. To our knowledge, this represents the first successful sim-to-real transfer of a world-action model for robotic manipulation."
    authors={{
    "Zixing Wang":[],
    "Jinghuan Shang":[],
    "Yafei Hu":[],
    "Ran Gong":[],
    "Xiaohan Zhang":[],
    "Karl Schmeckpeper":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/30_Efficient_Sim_to_Real_Trans.pdf"
    />,
  <Paper
    title="SpatialBench-R: Evaluating Vision-Language Models on Robot-Relevant Spatial Reasoning for Tabletop Manipulation"
    abstract="VLMs are increasingly deployed as planners in manipulation pipelines, yet their configuration-dependent spatial reasoning (reachability, occlusion, and action effects) remains poorly understood. We present SpatialBench-R (Robotics), a benchmark of 1,632 QA pairs across six robot-relevant task types from 300 synthetic 3D tabletop scenes. We evaluate GPT-5.5, Qwen3-VL-8B, and Gemini-2.5-Flash under image-only, coordinate-augmented, and scene-graph prompting, and introduce an intervention protocol that perturbs robot configurations to measure whether models update their spatial judgments. Under image-only prompting, reach-zone estimation and action-effect prediction are near chance. Structured prompts yield large but task-dependent gains, exposing a gap between static scene description and configuration-dependent inference."
    authors={{
    "Mengti Sun":[],
    "Bowen Jiang":[],
    "Minxi Duan":[],
    "Camillo Jose Taylor":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/31_SpatialBench_R_Evaluating_V.pdf"
    />,
  <Paper
    title="Where Do Affordances Crystallize? Video vs. Image Self-Supervised Encoders for Embodied Perception"
    abstract="Self-supervised video models are strong backbones for robotic perception. We probe 25 layer positions of architecturally matched ViT-L encoders (V-JEPA 2, V-JEPA 2.1, DINOv2) on the UMD Part Affordance Dataset and show that video SSL models crystallize affordance signal at layer 19—four layers earlier than DINOv2 (image SSL, layer 23), suggesting a consistent effect of temporal predictive objectives on representation depth. Both V-JEPA variants share the same peak depth, yet V-JEPA 2.1's intermediate-layer supervision yields markedly stronger early-layer representations (layer 2 mAP: $92.2\%$ vs. $85.0\%$ for V-JEPA 2). Head ablation at each peak layer further reveals a sparse set of attention heads that concentrate the affordance signal; keeping only the top-3 heads achieves a $5.3\times$ attention compute reduction with $\leq 0.1\%$ mAP loss."
    authors={{
    "Abrar Zahin Raihan":[],
    "Aurchi Chowdhury":[],
    }}
    affiliations={[]}
    pdf="/papers/2026/32_Where_Do_Affordances_Crysta.pdf"
    />,
];

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
      platform: "Isaac Sim",
      sceneDataset: "Arnold Dataset",
      observations: "RGB-D, Proprioception",
      actionSpace: "Continuous",
      stochasticAcuation: "✓",
      winner: "",
    },
    {
      challenge: challengePageMap["ManiSkillViTac"],
      key: "maniskill-vitac",
      task: "Vision-Tactile Fusion Bimanual Manipulation",
      interactiveActions: "✓",
      platform: "Real Bimanual Robot",
      sceneDataset: "Customized Scenarios",
      observations: "Wrist Image, Tactile Image, Proprioception",
      actionSpace: "Continuous",
      stochasticAcuation: "",
      winner: "",
    },
    {
      challenge: challengePageMap["ManipArena"],
      key: "ManipArena",
      task: "Desktop and Mobile Manipulation",
      interactiveActions: "✓",
      platform: "Isaac Lab Arena (simulation), UR, Franka, ARX, Spatiotemporal AI Arm, x2robot Arm",
      sceneDataset: "Custom Dataset",
      actionSpace: "Continuous",
      observations: "RGB, joint angles, joint torques",
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
      // headerGradient="linear-gradient(0deg, #e2d2b9, #153968)"
      // 2026 variant
      // headerGradient="radial-gradient(#330066, #ff9933)"
      headerGradient="linear-gradient(0deg, #ba7d58, #203a58)"

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
            background-image: url("/images/cvpr2026/cover-small.png");
            background-size: cover;
            background-position: center;
          `,
      }}
      conference="CVPR 2026 - Denver"
      rightSide={
        <Challenges
          conference="CVPR 2026"
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

          While this is a tall order, fantastic advances in deep learning,
          the explosive growth of large language models, and the
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
          EAI 2026’s overaching theme
          is <b>World Models for Embodied AI:</b> embodied AI agents that create models of the
          world to help them imagine and act, or to help researchers to test and evaluate them.

          This umbrella theme is divided into three topics:
          <ul>
            <li>
              <b>World Models for Action and Evaluation</b> Explores both dynamics models which
              incorporate physics and geometry, and video models where dynamics are implicit.
            </li>
            <li>
              <b>The Resurgence of Classic Methods</b> Examining new applications of techniques
              such as reinforcement learning and model-predictive control to embodied AI.
            </li>
            <li>
              <b>Long-Horizon Embodied Intelligence</b> Explores benchmarks and methods for
              multi-step tasks, robust testing, and, in particular, safe operation.
            </li>
          </ul>


          For more information on the Embodied AI Workshop series, see our
          {" "}<a href="https://arxiv.org/abs/2210.06849">Retrospectives</a>{" "}
          paper on the first three years of the workshop. For the latest updates,
          follow the Embodied AI Medium blog at
          {" "}<a href="https://medium.com/embodied-artificial-intelligence">medium.com/embodied-artificial-intelligence</a>.
        </p>
        <EmailSubscription
          actionIdentifier="1FAIpQLSeIZrn-tk7Oain2R8gc_Q0HzLMLQ9XXwqu3KecK_E5kALpiug"
          entryNumber={1834823104}
        />
      </Section>
      <Section title="Attending">
        <p>
          The Embodied AI 2026 workshop was held in conjunction with
          {" "}<a href="https://cvpr.thecvf.com/Conferences/2026">CVPR 2026</a>{" "}
          in Denver, Colorado. It featured a host of invited
          talks covering a variety of topics in Embodied AI, many exciting
          Embodied AI challenges, a poster session, and panel discussions.

          The Embodied AI workshop was held in-person with remote options
          on June 4th from 8:45 to 5:30 MDT:
          <ul>
            <li><b>In-Person:</b> Workshop talks and panels were held in room 107 from 8:45-noon and 1:30-5:30 MDT.
            </li>
            <li><b>Remote:</b> Zoom info for remote CVPR attendees can be found on
              {" "}<a href="https://cvpr.thecvf.com/virtual/2026/workshop/36064">our official CVPR workshop page</a>.</li>
            <li><b>Questions:</b> We will have a microphone; also questions (in-person or remote) can be asked via Slack at: <InlineSlack /></li>
            <li><b>Posters:</b> Posters were held in Exhibit Hall A from 12:00 PM to 1:30 PM MDT at boards 262 - 276.
              Oral presentations were held in room 107 from 4:30-5:00 PM MDT.
            </li>
            <li><b>Printing:</b> Information on poster printing was available on CVPR's website.</li>
          </ul>
          For late-breaking updates from CVPR, see the workshop's CVPR page.
        </p>
      </Section>

      <Section title="Timeline">
        <Steps progressDot current={6} direction="vertical">
          <Step title="Workshop Announced" description="February 2nd, 2026" />
          <Step
            title="Paper Submission Deadline"
            description={<><s>April 3rd</s>  <b>May 15th</b>, 2026</>}
          />
          <Step
            title="Paper Notification Deadline"
            description={<><s>April 24th</s>  <b>May 27th</b>, 2026</>}
          />
          <Step
            title="Challenge Submission Deadlines"
            description="May-June, 2026. Check each challenge for the specific date."
          />
          <Step
            title="Camera Ready Copy Deadline"
            description={<><s>May 15th</s>  <b>June 1st</b>, 2026</>}
          />
          <Step
            title="Seventh Annual Embodied AI Workshop at CVPR"
            description={
              <>
                <a href={"https://cvpr.thecvf.com/Conferences/2026"} target="_blank">
                  Denver, Colorado
                </a>{" "}
                <br />
                June 4th, 2026
                <br />
                Room 107
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
          <li><b>Workshop Talks: 8:45AM-5:30PM MDT - Room 107</b></li>
          <li><b>Poster Session: 12:00PM-1:30PM MDT - Exhibit Hall A Boards 262-276</b></li>
          <li><b>Virtual Sessions:</b>{" "}
            <a href="https://cvpr.thecvf.com/virtual/2026/workshop/36064">Workshop page</a>{" "}
            available to registered CVPR attendees.</li>
        </ul>
        Note an earlier version of the website said CDT, but the timezone is MDT, the same as the rest of CVPR.
        <br />
        Zoom information can be found for CVPR attendees on
        our official CVPR workshop page when it becomes available.
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
          <Timeline>
            <Timeline.Item>
              <b>Workshop Introduction: Embodied AI</b>
              <br />
              <Time time="8:45 - 9:00 AM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["Logical Robotics"]}
                name="Anthony Francis"
                fixedImg={data.anthony.childImageSharp.fixed}
                noMargin={true}
              />
            </Timeline.Item>

            <Timeline.Item>
              <b>Challenge Presentations - Winning Methods</b>
              <br />
              <Time time="9:00 - 10:00 AM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["CSIRO"]}
                name="Moderator - David Hall"
                fixedImg={data.davidH.childImageSharp.fixed}
                noMargin={true}
              />

            </Timeline.Item>

            <Timeline.Item>
              <b>Challenge Q&A</b>
              <br />
              <Time time="10:00 - 10:30 AM MDT" />
              <br />
              Location: Room 107
            </Timeline.Item>

            <Timeline.Item>
              <b>Invited Talk - Siyuan Huang, BIGAI</b>
              <br />
              <i>Title: Understanding the 3D World for General Agents</i>
              <br />
              <Time time="10:30 - 11:00 AM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["BIGAI"]}
                name="Siyuan Huang"
                fixedImg={data.siyuanHuang.childImageSharp.fixed}
                noMargin={true}
              />
              <p>Bio: Siyuan Huang is a Research Scientist at the Beijing Institute for General Artificial Intelligence (BIGAI), directing the Center of Embodied AI and Robotics. He received his Ph.D. from the Department of Statistics at the University of California, Los Angeles (UCLA). His research aims to build a general robot capable of understanding and interacting with 3D environments like humans. His research has received multiple awards including the best paper award of CoRL2025 and several workshop best papers.</p>
              <Abstract
                text="Abstract: While current world models exhibit impressive predictive capabilities, their reliance on 2D image sequences masks a critical lack of genuine geometric, spatial, and physical understanding. For general embodied agents to interact reliably with their environments, we must move beyond pixel-level imitation and pursue a native, structural grasp of the three-dimensional world. This talk highlights key insights into bridging this gap by explicitly modeling 3D geometry and scaling spatial reasoning. Specifically, we will discuss how leveraging foundational video models can extract robust spatial priors to enhance comprehensive scene understanding, and how integrating explicit 3D representations—such as Gaussian models—provides the physical grounding necessary for accurate simulation and complex manipulation tasks. Ultimately, shifting from 2D approximations to grounded 3D structures is essential for building world models that truly comprehend the physical reality they operate within."
              />
            </Timeline.Item>

            <Timeline.Item>
              <b>Invited Talk - Stefan Leutenegger, ETH Zurich</b>
              <br />
              <i>Title: Spatial AI and Robot Learning for the Real World</i>
              <br />
              <Time time="11:00 - 11:30 AM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["ETH Zurich"]}
                name="Stefan Leutenegger"
                fixedImg={data.stefanLeutenegger.childImageSharp.fixed}
                noMargin={true}
              />
              <p>Bio: Prof. Dr. Stefan Leutenegger is an Associate Professor in the Department of Mechanical and Process Engineering of ETH Zurich.</p>
              <Abstract
                text="Abstract: TBD"
              />
            </Timeline.Item>

            <Timeline.Item>
              <b>Invited Talk - Lewis Chiang, Google DeepMind</b>
              <br />
              <i>Title: Why Are Robot Agents So Hard?</i>
              <br />
              <Time time="11:30 AM - 12:00 PM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["Google DeepMind"]}
                name="Lewis Chiang"
                fixedImg={data.lewisChiang.childImageSharp.fixed}
                noMargin={true}
              />
              <p>Bio: Lewis Chiang is a Research Scientist at Google DeepMind, where he works on Gemini Robotics. His research focuses on developing real-time robot agents. Prior to joining Google DeepMind, Lewis worked at Waymo, where he worked on motion prediction and planning.</p>
              <Abstract
                text="Abstract: TBD"
              />

            </Timeline.Item>

            <Timeline.Item>
              <b>Lunch / Accepted Papers Poster Session</b>
              <br />
              <Time time="12:00 PM - 1:30 PM MDT" />
              <br />
              Location: Exhibit Hall A, Boards 262 - 276
            </Timeline.Item>

            <Timeline.Item>
              <b>Invited Talk - Ruiqi Gao, Google DeepMind</b>
              <br />
              <i>Title: World Models for Embodied AI</i>
              <br />
              <Time time="1:30 - 2:00 PM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["Google DeepMind"]}
                name="Ruiqi Gao"
                fixedImg={data.ruiqiGao.childImageSharp.fixed}
                noMargin={true}
              />
              <p>Bio: I am a Research Scientist at Google DeepMind. I am mainly interested in generative models and representation learning. My recent research focus is to construct powerful generative AI models that can comprehend, generate, and reason with multi-modal data, including natural language, images, videos and 3D. I obtained my Ph.D. from UCLA advised by Song-Chun Zhu and Ying Nian Wu. Prior to that, I received my B.S. degree of Statistics from Peking University..</p>
              <Abstract
                text="Abstract: TBD"
              />
            </Timeline.Item>

            <Timeline.Item>
              <b>Invited Talk - Tapomayukh Bhattacharjee, Cornell University</b>
              <br />
              <i>Title: Embodied Intelligence for Physical Contact with Humans: Towards Safe Caregiving Robots in the Real World</i>
              <br />
              <Time time="2:30 - 3:00 PM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["Cornell University"]}
                name="Tapomayukh Bhattacharjee"
                fixedImg={data.tapomayukhBhattacharjee.childImageSharp.fixed}
                noMargin={true}
              />
              <p>Bio: Tapomayukh "Tapo" Bhattacharjee is an Assistant Professor in the Department of Computer Science at Cornell University where he directs the EmPRISE Lab (https://emprise.cs.cornell.edu/). He completed his Ph.D. in Robotics from Georgia Institute of Technology and was an NIH Ruth L. Kirschstein NRSA postdoctoral research associate in Computer Science & Engineering at the University of Washington. His primary research interests are in the area of physical robot caregiving and physical human-robot interaction. He is the recipient of TRI Young Faculty Researcher Award'24, NSF CAREER Award'23, AFCEA 40 under 40 Award'22, and his work has won Best Systems Paper Award at HRI’26, Best Paper Award at RSS’25, Best Paper and Student Paper Award Finalist and Best HRI Paper Award Finalist at ICRA’25, Best Systems Paper Award Finalist at HRI'24, Best Demo Award at HRI'24, Best RoboCup Paper Award at IROS’22, Best Paper Award Finalist and ABB Best Student Paper Award Finalist at IROS’22, Best Technical Advances Paper Award at HRI'19, and Best Demonstration Award at NeurIPS’18. His work has also been featured in many media outlets including the BBC, Reuters, New York Times, IEEE Spectrum, and GeekWire and his robot-assisted feeding work was selected to be one of the best interactive designs of 2019 by Fast Company. </p>
              <Abstract
                text="Abstract: Physical contact with humans remains one of the most important and underexplored challenges in embodied AI. To operate safely and effectively in real-world environments shared with humans, robots must reason about and adapt to the diverse behaviors, capabilities, and needs of the people around them. Physical caregiving tasks such as feeding, bathing, and transferring exemplify this challenge, requiring safe physical human-robot interaction in dynamic, unstructured settings. In this talk, I will present research from the EmPRISE Lab on building embodied intelligence for physical contact with humans. I will highlight our work on multimodal contact representations, personalized contact-aware control, and user-context aware robot assistance, as well as lessons from deploying these systems with end users. Together, these efforts provide insights into the representations, learning algorithms, and safety considerations needed for real-world physical caregiving robots."
              />
            </Timeline.Item>

            <Timeline.Item>
              <b>Invited Talk - Yilun Du, Harvard</b>
              <br />
              <i>Title: World Models for Robot Manipulation and Planning</i>
              <br />
              <Time time="2:30 - 3:00 PM MDT" />
              <br />
              Location: Room 107
              <p>Bio: I am an Assistant Professor at Harvard in the Kempner Institute and CS, where I run the Embodied Minds lab. I received my PhD at MIT EECS, advised by Prof. Leslie Kaelbling, Prof. Tomas Lozano-Perez and Prof. Joshua B. Tenenbaum. Previously, I also obtained my bachelor's degree from MIT, was a research fellow at OpenAI, and a senior research scientist at Google DeepMind. My research focuses on generative models, decision making, robot learning, embodied agents, and the applications of such tools to scientific domains.</p>
              <Speaker
                organizations={["Harvard"]}
                name="Yilun Du"
                fixedImg={data.yilunDu.childImageSharp.fixed}
                noMargin={true}
              />
              <Abstract
                text="Abstract: I'll talk about a couple methods in which world models can be useful for robotics applications. First, I'll talk about how they can be used as policies or imaginations depicting what to do in future steps. I'll talk about how they can be used in action-conditioned simulation and MPC. Finally, I'll talk about how they can be combined with VLMs for long horizon task planning."
              />
            </Timeline.Item>

            <Timeline.Item>
              <b>Invited Talk - Wayne Wu, UCLA</b>
              <br />
              <i>Title: From Scaling up to Scaling out: Reality World Simulators for Physical AI</i>
              <br />
              <Time time="3:00 - 3:30 PM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["UCLA"]}
                name="Wayne Wu"
                fixedImg={data.wayneWu.childImageSharp.fixed}
                noMargin={true}
              />
              <p>Bio:
                I am an AI Researcher in the Department of Computer Science at the University of California, Los Angeles (UCLA), working with Bolei Zhou, and collaborating with Trevor Darrell (UC Berkeley EECS) and Jiaqi Ma (UCLA CEE). I was a Visiting PhD at Nanyang Technological University, working with Chen Change Loy. I received my Ph.D. from the Department of Computer Science and Technology at Tsinghua University. </p>
              <Abstract
                text="Abstract: Recent progress in large language and vision models demonstrates how far we can go by scaling with vast internet-scale data. In contrast, physical AI, agents that perceive and act in the real world, still lags far behind. Today, both academia and industry primarily pursue generalizable physical AI by scaling up: collecting large-scale action–video datasets or training world models that enable interaction through learned environments. However, this paradigm is inherently inefficient and will soon reach a data ceiling. In this talk, I argue for a shift from scaling up to scaling out. I introduce reality world simulators, a new paradigm that converts real-world videos into diverse, interactive simulation environments. Instead of relying on more data collection, this approach expands data through structured reconstruction and recomposition, enabling both higher data efficiency and physically grounded interaction. I will present a three-pronged approach: 1) Scaling out via Digital Twins: reconstructing controllable, interactive environments from monocular videos to support diverse agent exploration. 2) Scaling out via Digital Cousins: disentangling scene structure into compositional elements to generate large-scale variations of real-world environments. 3) Scaling out via Embodied Humans: incorporating realistic human dynamics to improve safety and social compliance in robot learning. Finally, I will outline a roadmap toward building generalizable and safe physical AI systems for open-world deployment."
              />
            </Timeline.Item>
            <Timeline.Item>
              <b>Industry Talk - Sarah Parisot, Microsoft Research Cambridge</b>
              <br />
              <i>Title: Building World Models for Creative Use</i>
              <br />
              <Time time="3:30 - 4:00 PM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["Microsoft Research Cambridge"]}
                name="Sarah Parisot"
                fixedImg={data.sarahParisot.childImageSharp.fixed}
                noMargin={true}
              />
              <p>Bio: I am a Principal Researcher in the Game Intelligence(opens in new tab) team which develops novel machine learning technology with applications to video games and beyond. My research interests and experience include parameter efficient learning, computer vision and generative AI. My recent work has focused on text-to-image generative models, with an emphasis on controllability and interactivity. Prior to joining Microsoft, I was a Senior Research Scientist and Team Leader at Huawei Noah’s Ark Lab in London.</p>
              <Abstract
                text="World models offer a path toward interactive, co‑creative systems that support iteration, exploration, and sustained creative control. To be useful to creators, such models must balance expressiveness with practical constraints such as data efficiency, responsiveness, and inference cost. This talk explores the interplay between model considerations and creative intent, including how representation choices, efficiency, and data strategy can shape creative use."
              />
            </Timeline.Item>

            <Timeline.Item>
              <b>Invited Talk - Dinesh Jayaraman, UPenn GRASP Lab</b>
              <br />
              <i>Title: Coding Agent-Driven Robot Learning</i>
              <br />
              <Time time="4:00 - 4:30 PM MDT" />
              <br />
              Location: Room 107
              <p>Bio: I am an associate professor at UPenn’s GRASP lab, with a primary appointment in CIS, and a secondary appointment in ESE. I lead the Perception, Action, and Learning (PennPAL) Research Group, where we work on problems at the intersection of robotics, machine learning, and computer vision.</p>
              <Speaker
                organizations={["UPenn GRASP Lab"]}
                name="Dinesh Jayaraman"
                fixedImg={data.dineshJayaraman.childImageSharp.fixed}
                noMargin={true}
              />
              <Abstract
                text="Abstract: TBD"
              />

            </Timeline.Item>

            <Timeline.Item>
              <b>Accepted Paper Highlights</b>
              <br />
              <Time time="4:30 - 5:00 PM MDT" />
              <br />
              Location: Room 107
            </Timeline.Item>


            <Timeline.Item>
              <b>Debate - Long-Horizon Safety in Embodied AI</b>
              <br />
              <Time time="5:00 - 5:30 PM MDT" />
              <br />
              Location: Room 107
              <Speaker
                organizations={["Logical Robotics"]}
                name="Moderator - Anthony Francis"
                fixedImg={data.anthony.childImageSharp.fixed}
                noMargin={true}
              />
            </Timeline.Item>

            <Timeline.Item>
              <b>Workshop Concludes</b>
              <br />
              <Time time="5:30 PM MDT" />
              <br />
              Location: Room 107
            </Timeline.Item>
          </Timeline>
        </div>
      </Section>
      <Section title="Sponsor Events">
        <br />
      </Section>
      <Section title="Challenges">
        <p>
          The Embodied AI 2026 workshop is hosting many exciting challenges
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
          challenge's presentation at the workshop. Since many challenges can be
          grouped into similar tasks, we encourage participants to submit models
          to more than 1 challenge.
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
                  2026 Winner
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
                  Platform
                </>
              ),
              dataIndex: "platform",
              key: "platform",
              sorter: (a, b) =>
                a.platform.localeCompare(b.platform),
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
              World Models for Action and Evaluation
            </li>
            <li>
              Classical Methods for Embodied AI
            </li>
            <li>
              Long-Horizon Embodied Intelligence
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
              Embodied AI Foundation Models
            </li>
            <li>
              Embodied Vision &amp; Language
            </li>
            <li>
              Language Model Planning
            </li>
            <li>
              Advances in Simulation for Embodied AI
            </li>
          </ul>
          Accepted papers will be presented as posters or spotlight talks at the
          workshop. These papers will be made publicly available in a
          non-archival format, allowing future submission to archival journals
          or conferences. Paper submissions do not have to be anononymized. Per{" "}
          <a
            href="https://cvpr.thecvf.com/Conferences/2026/AuthorGuidelines"
            target="_blank"
          >
            CVPR rules
          </a>{" "}
          regarding workshop papers, at least one author must register for CVPR
          using an in-person registration.
        </p>
        <SubSection title="Submission">
          <p>
            The submission deadline will close May 15th, 2026 (
            Anywhere on Earth - for clarity, 00:01 in GMT as computed by OpenReview).
            Papers should be no longer than 2 pages (excluding references) and styled
            in the{" "}
            <a href="https://cvpr.thecvf.com/Conferences/2026/AuthorGuidelines" target="_blank">
              CVPR format
            </a>.
            <ul>
              <li>
                <a href="https://openreview.net/group?id=thecvf.com/CVPR/2026/Workshop/EAI">
                  Paper submissions will close May 15th, 2026.
                </a>
              </li>
              <li>
                Notifications will be sent May 27th 2026.
                {/* The <a href="https://openreview.net/group?id=thecvf.com/CVPR/2023/Workshop/EAI">paper submission link is LIVE.</a> */}
              </li>
              <li>
                Camera-ready copies of accepted papers will be due June 1st, 2026.
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
        <p style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <a href="https://logicalrobotics.com/">
            <img src="/images/sponsors/logical-robotics.png" height="60" alt="Logical Robotics" />
          </a>

          <a href="https://microsoft.com/">
            <img src="/images/sponsors/microsoft-logo.png" height="200" alt="Microsoft" />
          </a>

        </p>
      </Section>
      <Section title="Organizers">
        The Embodied AI 2026 workshop is a joint effort by many
        researchers from a variety of organizations. Each year, a set of
        lead organizers takes point coordinating with the CVPR conference,
        backed up by a team of workshop organizers, challenge organizers,
        and scientific advisors.
        <SubSection title="Lead Organizers">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.cvpr2026.organizers
              .filter((organizer: any) => organizer.lo === true)
              .sort((a, b) => a.name.localeCompare(b.name))}
            data={data}
          />
        </SubSection>
        <SubSection title="Organizing Committee">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.cvpr2026.organizers
              .filter((organizer: any) => organizer.oc === true && organizer.lo === false)
              .sort((a, b) => a.name.localeCompare(b.name))}
            data={data}
          />
        </SubSection>
        <SubSection title="Challenge Organizers">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.cvpr2026.organizers
              .filter((organizer: any) => organizer.challenge === true)
              .sort((a, b) => a.name.localeCompare(b.name))}
            data={data}
          />
        </SubSection>

        <SubSection title="Scientific Advisory Board">
          <OrganizerPics
            organizers={data.allSite.nodes[0].siteMetadata.cvpr2026.organizers
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
          cvpr2026 {
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
    davidH: file(relativePath: { eq: "organizers/davidH.jpg" }) {
      ...FaceThumbnail
    }
    dieter: file(relativePath: { eq: "cvpr2023/dieter.jpg" }) {
      ...FaceThumbnail
    }
    luca: file(relativePath: { eq: "organizers/luca.jpg" }) {
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
    peymanOrg: file(relativePath: { eq: "organizers/peyman-moghadam.jpg" }) {
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
    jianweiYang: file(relativePath: { eq: "cvpr2025/jianwei-yang.jpg" }) {
      ...FaceThumbnail
    }
    lerrelPinto: file(relativePath: { eq: "cvpr2025/lerrel-pinto.jpg" }) {
      ...FaceThumbnail
    }
    raresAmbrus: file(relativePath: { eq: "cvpr2025/rares-ambrus.jpg" }) {
      ...FaceThumbnail
    }
    rikaAntonova: file(relativePath: { eq: "cvpr2025/rika-antonova.jpg" }) {
      ...FaceThumbnail
    }
    nikhilMohan: file(relativePath: { eq: "cvpr2025/nikhil-mohan.png" }) {
      ...FaceThumbnail
    }
    jiayunWang: file(relativePath: { eq: "cvpr2025/jiayun-wang.jpg" }) {
      ...FaceThumbnail
    }
    lewisChiang: file(relativePath: { eq: "cvpr2026/lewis-chiang.png" }) {
      ...FaceThumbnail
    }
    sarahParisot: file(relativePath: { eq: "cvpr2026/sarah-parisot.png" }) {
      ...FaceThumbnail
    }
    yilunDu: file(relativePath: { eq: "cvpr2026/yilun-du.jpg" }) {
      ...FaceThumbnail
    }
    dineshJayaraman: file(relativePath: { eq: "cvpr2026/dinesh-jayaraman.jpg" }) {
      ...FaceThumbnail
    }
    katjaHoffman: file(relativePath: { eq: "cvpr2026/katja-hoffman.jpg" }) {
      ...FaceThumbnail
    }
    tapomayukhBhattacharjee: file(relativePath: { eq: "cvpr2026/tapomayukh-bhattacharjee.jpg" }) {
      ...FaceThumbnail
    }
    stefanLeutenegger: file(relativePath: { eq: "cvpr2026/stefan-leutenegger.jpg" }) {
      ...FaceThumbnail
    }
    siyuanHuang: file(relativePath: { eq: "cvpr2026/siyuan-huang.png" }) {
      ...FaceThumbnail
    }
    baoxiongJia: file(relativePath: { eq: "cvpr2026/baoxiong-jia.jpg" }) {
      ...FaceThumbnail
    }
    ruiqiGao: file(relativePath: { eq: "cvpr2026/ruiqi-gao.png" }) {
      ...FaceThumbnail
    }
    jiaolongYang: file(relativePath: { eq: "cvpr2026/jiaolong-yang.jpg" }) {
      ...FaceThumbnail
    }
    wayneWu: file(relativePath: { eq: "cvpr2026/wayne_wu.jpg" }) {
      ...FaceThumbnail
    }
    huanLing: file(relativePath: { eq: "cvpr2025/huan-ling.png" }) {
      ...FaceThumbnail
    }
    yizhouOrg: file(relativePath: { eq: "organizers/yizhou.jpg" }) {
      ...FluidImage
    }
    ruiOrg: file(relativePath: { eq: "organizers/Rui_Chen.jpg" }) {
      ...FluidImage
    }
    chaoyiOrg: file(relativePath: { eq: "organizers/Chaoyi_Liu.jpg" }) {
      ...FluidImage
    }
    chuanyuOrg: file(relativePath: { eq: "organizers/Chuanyu_Li.jpg" }) {
      ...FluidImage
    }
    rongxuanOrg: file(relativePath: { eq: "organizers/Rongxuan_Zhang.jpg" }) {
      ...FluidImage
    }
    shaoweiOrg: file(relativePath: { eq: "organizers/Shaowei_Cui.png" }) {
      ...FluidImage
    }
    wenxuanOrg: file(relativePath: { eq: "organizers/Wenxuan_Ma.jpg" }) {
      ...FluidImage
    }
    rongtaoOrg: file(relativePath: { eq: "organizers/rongtao_xu.jpg" }) {
      ...FluidImage
    }
    xiaodanOrg: file(relativePath: { eq: "organizers/Xiaodan_Liang.jpg" }) {
      ...FluidImage
    }
    mengOrg: file(relativePath: { eq: "organizers/Meng_Cao.jpg" }) {
      ...FluidImage
    }
    yuOrg: file(relativePath: { eq: "organizers/Yu_Sun.jpg" }) {
      ...FluidImage
    }
    haoyuOrg: file(relativePath: { eq: "organizers/Haoyu_Zhu.png" }) {
      ...FluidImage
    }
    maOrg: file(relativePath: { eq: "organizers/Ma_Liang.jpg" }) {
      ...FluidImage
    }
    ivanOrg: file(relativePath: { eq: "organizers/ivan_laptev.jpg" }) {
      ...FluidImage
    }
    ianOrg: file(relativePath: { eq: "organizers/ian_reid.jpg" }) {
      ...FluidImage
    }
    heewonOrg: file(relativePath: { eq: "organizers/heewon_kim.jpg" }) {
      ...FluidImage
    }
    qianOrg: file(relativePath: { eq: "organizers/qian_wang.png" }) {
      ...FluidImage
    }
    
    # Other pictures
    ariaDemo: file(relativePath: { eq: "cvpr2024/aria-demo.jpg" }) {
      ...FluidImage
    }
    workshopLocation: file(relativePath: { eq: "cvpr2025/workshop-location.png" }) {
      ...FluidImage
    }
  }
`;
