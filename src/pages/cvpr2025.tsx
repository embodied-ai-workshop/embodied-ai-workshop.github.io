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

let acceptedPapers = [
  <Paper
    title="Real-Time Multimodal Processing for Interpreting Embodied Actions"
    abstract="In this paper, we demonstrate how real-time integration of language with embodied gesture and action in a collaborative task enables the generation of AI agent interventions that result in ”positive friction”, or reflection, deliberation, and more mindful collaboration. Further, we demonstrate how the same framework can be adapted toward agent action generation for real-time task guidance."
    authors={{
    "Hannah VanderHoeven":[],
    "Videep Venkatesha":[],
    "Abhijnan Nath":[],
    "Nikhil Krishnaswamy":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/1_Real_Time_Multimodal_Process.pdf"
    />,
  <Paper
    title="On the use of Pre-trained Visual Representations in Visuo-Motor Robot Learning"
    abstract="The use of pre-trained visual representations (PVRs) in visuo-motor robot learning offers an alternative to training encoders from scratch but we discover that it faces challenges such as temporal entanglement and poor generalisation to minor scene changes. These issues hinder performance in tasks requiring temporal awareness and scene robustness. We address these limitations by: (1) augmenting PVR features with temporal perception and task completion signals to disentangle them over time, and (2) introducing a module that selectively attends to task-relevant local features, improving robustness in out-of-distribution scenes. Our approach, particularly effective for PVRs trained with masking objectives, shows significant performance gains."
    authors={{
    "Nikolaos Tsagkas":[],
    "Andreas Sochopoulos":[],
    "Duolikun Danier":[],
    "Sethu Vijayakumar":[],
    "Chris Xiaoxuan Lu":[],
    "Oisin Mac Aodha":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/2_On_the_use_of_Pre_trained_Vi.pdf"
    />,
  <Paper
    title="H^3 DP: Triply‑Hierarchical Diffusion Policy for Visuomotor Learning"
    abstract="We introduce Triply-Hierarchical Diffusion Policy (H^3DP), a novel visuomotor learning framework that explicitly incorporates hierarchical structures to strengthen the integration between visual features and action generation. H$^{3}$DP contains $\mathbf{3}$ levels of hierarchy: (1) depth-aware input layering; (2) multi-scale visual representations; and (3) a hierarchically conditioned diffusion process. Extensive experiments demonstrate that H$^{3}$DP yields a $\mathbf{+27.5}$% average relative improvement over baselines across $\mathbf{44}$ simulation tasks and achieves superior performance in $\mathbf{4}$ challenging bimanual real-world manipulation tasks. Project Page: https://lyy-iiis.github.io/h3dp/."
    authors={{
    "Yiyang Lu":[],
    "Yufeng Tian":[],
    "Zhecheng Yuan":[],
    "Xianbang Wang":[],
    "Pu Hua":[],
    "Zhengrong Xue":[],
    "Huazhe Xu":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/3_H_3_DP_Triply_Hierarchical_D.pdf"
    />,
  <Paper
    title="Multi-Step Guided Diffusion for Image Restoration on Edge Devices: Toward Lightweight Perception in Embodied AI"
    abstract="Diffusion models have shown remarkable flexibility for solving inverse problems without task-specific retraining. However, existing approaches like Manifold Preserving Guided Diffusion (MPGD) apply only a single gradient update per denoising step, limiting restoration fidelity and robustness—especially in embedded or out-of-distribution settings. In this work, we introduce a multi-step optimization strategy within each denoising timestep, significantly enhancing image quality, perceptual accuracy, and generalization. Our experiments on 4× super-resolution and Gaussian deblurring demonstrate that increasing the number of gradient updates per step improves LPIPS and PSNR, with minimal latency overhead. Notably, we validate this approach on a Jetson Orin Nano using degraded ImageNet and UAV123 aerial imagery, showing that MPGD—originally trained on face datasets—generalizes effectively to natural and aerial scenes. Our findings highlight MPGD’s potential as a lightweight, plug-and-play restoration module for real-time visual perception in embodied AI agents such as drones and mobile robots."
    authors={{
    "Aditya Chakravarty":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/4_Multi_Step_Guided_Diffusion_.pdf"
    />,
  <Paper
    title="EED: Embodied Environment Description through Robotic Visual Exploration"
    abstract="The optimal way to convey information about a real environment to humans is through natural language descriptions. With the remarkable advancements in large language models and the field of Embodied AI in recent years, it has become possible for robots to autonomously navigate environments while recognizing and understanding their surroundings, much like humans do. In this paper, we propose a new Embodied AI task in which an autonomous mobile robot explores an environment and summarizes the entire environment in natural language. To properly evaluate this task, we use a crowdsourcing service to collect human-generated environment descriptions and construct a benchmark dataset. Additionally, the evaluation is conducted through a crowdsourcing service. Furthermore, we propose a baseline reinforcement learning method for the robot's environment exploration behavior to perform this task, demonstrating its superior performance compared to existing visual exploration methods."
    authors={{
    "Kohei Matsumoto":[],
    "Asako Kanezaki":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/5_EED_Embodied_Environment_Des.pdf"
    />,
  <Paper
    title="R-EQA: Retrieval-Augmented Generation for Embodied Question Answering"
    abstract="Embodied Question Answering (EQA) is a task where an agent explores its environment, gathers visual information and responds to natural language questions based on that information. The accuracy of the answer depends on which visual information is sampled for a given question. This study introduces R-EQA, a framework that uses Retrieval-Augmented Generation to evaluate the effectiveness of sampling semantically relevant visual information in the EQA setting. Experiments using the OpenEQA benchmark show that R-EQA achieves 10\% higher performance compared to uniform sampling. This indicates that selective sampling of question-relevant information plays a critical role in improving answer quality in EQA."
    authors={{
    "Hyobin Ong":[],
    "Minsu Jang":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/6_R_EQA_Retrieval_Augmented_Ge.pdf"
    />,
  <Paper
    title="Uncertainty Modeling in Autonomous Vehicle Trajectory Prediction: A Comprehensive Survey"
    abstract="Agent Behavior prediction is a critical component in autonomous driving systems, requiring the modeling of inherent uncertainties in an agent's future motion. This survey provides a comprehensive overview of uncertainty quantification approaches in agent behavior prediction, categorizing them into three main paradigms: probabilistic distribution-based models, generative models, and heatmap-based representations. We analyze how these paradigms address different aspects of uncertainty - including intent ambiguity, control variations, and inter-agent interactions - and evaluate their performance across standard benchmarks. Our comparison reveals the trade-offs between model expressiveness, computational efficiency, and deployment practicality. We conclude by identifying promising research directions that could advance uncertainty-aware trajectory prediction, ultimately contributing to safer and more reliable autonomous driving systems in complex real-world environments."
    authors={{
    "Siddharth Raina":[],
    "Jeshwanth Challagundla":[],
    "Mantek Singh":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/7_Uncertainty_Modeling_in_Auto.pdf"
    />,
  <Paper
    title="ThinkSafe++: A Semantic Risk Score Framework for Safety-Aware Long-Horizon Planning"
    abstract="ThinkSafe++ is a safety framework for long-horizon task planning in embodied agents. While LLMs can generate flexible plans, they often lack fine-grained safety reasoning, which may lead to hazardous behavior. Prior methods, such as SafeAgentBench, use binary filters that tend to over-reject and fail to distinguish between different types of risk. To address these limitations, ThinkSafe++ assigns continuous risk scores to each action step and leverages risk-type-specific distributions to guide filtering decisions. This enables more adaptive and semantically grounded safety control. We introduce two filtering strategies: (1) Global Risk-Score Filtering and (2) Risk-Type-Based Filtering. Experiments show that ThinkSafe++ improves safe task completion by 5.9 percentage points and reduces residual risk from 6.8% to 1.25%, achieving gains in both safety and efficiency."
    authors={{
    "Yejin Jo":[],
    "Minsu Jang":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/8_ThinkSafe_A_Semantic_Risk_Sc.pdf"
    />,
  <Paper
    title="View-Imagination: Enhancing Visuomotor Control with Adaptive View Synthesis"
    abstract="In robotic manipulation tasks, visuomotor control suffers from limited spatial understanding problems with limited camera installation and visual imperfections, such as occlusion. In this paper, we propose view-imagination, a novel framework with incorporating viewpoint policy. We train a dynamic scene NeRF and a learnable viewpoint policy, enabling the robot to generate a maximum value viewpoint to improve affordance. In experiments, we demonstrate that view-imagination outperforms across various training configurations."
    authors={{
    "Dohyeok Lee":[],
    "Munkyung Kim":[],
    "Jung Min Lee":[],
    "Seungyub Han":[],
    "Jungwoo Lee":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/9_View_Imagination_Enhancing_V.pdf"
    />,
  <Paper
    title="Dynamics-Aligned Flow Matching Policy for Robot Learning"
    abstract=" Behavior cloning methods for robot learning suffer from poor generalization due to limited data support beyond expert demonstrations. While recent approaches leverage video prediction models to implicitly capture dynamics, they lack explicit action conditioning, leading to averaged predictions over actions that lose critical dynamics information. We propose a Dynamics-Aligned Flow Matching Policy that integrates dynamics predictions into policy learning through iterative flow generation. Our method introduces a novel architecture where policy and dynamics models share intermediate generation samples during training, enabling self-correction and improved generalization. Theoretical analysis demonstrates that conditioning on predicted dynamics leads to improved approximation to optimal actions, with empirical validation on Robomimic benchmarks."
    authors={{
    "Dohyeok Lee":[],
    "Jung Min Lee":[],
    "Munkyung Kim":[],
    "Seokhun Ju":[],
    "Seungyub Han":[],
    "Jin Woo Koo":[],
    "Jungwoo Lee":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/10_Dynamics_Aligned_Flow_Match.pdf"
    />,
  <Paper
    title="Data Augmentation in Diffusion Inversion Space"
    abstract="Visual imitation learning methods have demonstrated strong performance and potential, but their generalization ability to unseen environments remains limited. Although data augmentation offers an effective solution to this problem, current approaches depend on complex preprocessing procedures, require substantial hardware resources, are time-consuming, and struggle to comprehensively account for all possible environments. Our goal is to develop a data augmentation method that is simple, efficient, plug-and-play, and incurs no additional computational overhead. Our core idea is that, instead of performing data augmentation in the raw image space, conducting it in the diffusion inversion space can significantly simplify the augmentation process — to the extent that inserting simple geometric shapes is sufficient to achieve broader coverage of environmental variations. We designed a simple industrial-style scenario experiment to preliminarily validate our idea."
    authors={{
    "Junfeng Wei":[],
    "Rongsen Luo":[],
    "Ziming Cheng":[],
    "An Mo":[],
    "Chao Ji":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/11_Data_Augmentation_in_Diffus.pdf"
    />,
  <Paper
    title="Sim2real Image Translation Enables Viewpoint-Robust Policies from Fixed-Camera Datasets"
    abstract="Vision-based policies for robot manipulation have achieved significant recent success, but are still brittle to distribution shifts such as camera viewpoint variations. One reason is that robot demonstration data used to train such policies often lacks appropriate variation in camera viewpoints. Simulation offers a way to collect robot demonstrations at scale with comprehensive coverage of different viewpoints, but presents a visual sim2real challenge. To bridge this gap, we propose an unpaired image translation method with a novel segmentation-conditioned InfoNCE loss, a highly-regularized discriminator design, and a modified PatchNCE loss. We find that these elements are crucial for maintaining viewpoint consistency during translation. For image translator training, we use only real-world robot play data from a single fixed camera but show that our method can generate diverse unseen viewpoints. We observe up to a 46% absolute improvement in manipulation success rates under viewpoint shift when we augment real data with our sim2real translated data."
    authors={{
    "Jeremiah Coholich":[],
    "Justin Wit":[],
    "Zsolt Kira":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/13_Sim2real_Image_Translation_.pdf"
    />,
  <Paper
    title="EmbodiedSplat: Personalized Real-to-Sim-to-Real Navigation with Gaussian Splats from a Mobile Device"
    abstract=" Sim-to-real transfer and personalization remains a core challenge in Embodied AI due to a trade-off between synthetic environments lacking realism and costly real-world captures. We present EmbodiedSplat, a method that personalizes policy training by reconstructing deployment environments using a mobile device and 3D Gaussian Splatting, enabling efficient fine-tuning in realistic scenes via Habitat-Sim. Our analysis of training strategies and reconstruction techniques shows that EmbodiedSplat achieves significant gains—improving real-world ImageNav success by 20–40% over pre-trained policies in an out-of-domain scene—and exhibits strong sim-to-real correlation (0.87–0.97). Code and data will be made public."
    authors={{
    "Gunjan Chhablani":[],
    "Xiaomeng Ye":[],
    "Rynaa Grover":[],
    "Muhammad Zubair Irshad":[],
    "Zsolt Kira":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/14_EmbodiedSplat_Personalized_.pdf"
    />,
  <Paper
    title="Benchmarking Arbitrary Natural Language Tasks in 3D Open Worlds"
    abstract="3D-embodied autonomy toward arbitrary task outcomes is a long-standing goal in AI and Robotics. However, programmatically verifying arbitrary outcomes in open worlds is a challenge. This work proposes: (1) giving Minecraft agents the ability to capture screenshots as evidence for task completion and (2) having vision-language models (VLMs) evaluate these screenshots. We also present SemanticSteve, a high-level Minecraft skill library that includes a 'take screenshot' skill. We use an expert-annotated dataset of tricky task-screenshot pairs to evaluate the capabilities of GPT-4.1 in our proposed screenshot-evaluation role and find that it is indeed fit for the task. We make both the SemanticSteve library as well as the code and data for our experiments publicly available at https://github.com/sonnygeorge/semantic-steve."
    authors={{
    "Sonny George":[],
    "Chris Sypherd":[],
    "Rocco Ahching":[],
    "Dylan Cashman":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/15_Benchmarking_Arbitrary_Natu.pdf"
    />,
  <Paper
    title="BePo: Efficient Dual Representation for 3D Scene Understanding"
    abstract="3D scene understanding fundamentally underlies autonomous systems that power a variety of important applications such as Autonomous Driving, Robotics, and AR/VR. Designing an expressive and compact scene representation is key to its goal of recovering detailed geometry and semantics of the surrounding environment from sensory images. Previous methods have adopted dense grids which are resource intensive and unable to handle diverse object scales. More recent efforts explore sparse points-based representations that are more object-centric but inefficient at modeling the entire scene. We present an efficient dual representation, termed BePo, that addresses these shortcomings and demonstrate the superiority of such representation through 3D occupancy prediction, a central task in 3D scene understanding."
    authors={{
    "Yunxiao Shi":[],
    "Hong Cai":[],
    "Jisoo Jeong":[],
    "Yinhao Zhu":[],
    "Shizhong Han":[],
    "Amin Ansari":[],
    "Fatih Porikli":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/17_BePo_Efficient_Dual_Represe.pdf"
    />,
  <Paper
    title="LLM-Enhanced Rapid-Reflex Async-Reflect Framework for Real-Time Decision Making in Dynamically Changing Environments"
    abstract=" In the realm of embodied intelligence, the evolution of large language models (LLMs) has markedly enhanced agent decision making. Consequently, researchers have begun evaluating agent performance in dynamically changing high-risk scenarios, i.e., fire, flood, and wind scenarios in the HAZARD benchmark. Under these extreme conditions, the delay in decision making emerges as a crucial yet insufficiently studied issue. We propose a Time Conversion Mechanism (TCM) that translates decision-making delays into equivalent simulation frames, thus aligning cognitive and physical costs under a single FPS-based metric. By extending HAZARD with Respond Latency (RL) and Latency-to-Action Ratio (LAR), we deliver a fully latency-aware evaluation protocol. Moreover, we present the Rapid-Reflex Async-Reflect Framework (RRARF), which couples a lightweight LLM-guided feedback module with a rule-based agent to enable immediate reactive behaviors and asynchronous reflective refinements in situ. Experiments on HAZARD show that RRARF substantially outperforms existing baselines in latency-sensitive scenarios."
    authors={{
    "Yangqing Zheng":[],
    "Shunqi Mao":[],
    "Dingxin Zhang":[],
    "Weidong Cai":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/18_LLM_Enhanced_Rapid_Reflex_A.pdf"
    />,
  <Paper
    title="What matters in ImageNav: architecture, pre-training, sim settings, pose"
    abstract="State-of-the-art image goal navigation methods either rely on dedicated image-matching or pre-training of vision modules on relative pose estimation or image reconstruction. Recent findings suggest that ImageNav can be solved by very low-capacity ResNet with channel-wise stacking and RL-training alone, without pre-training. These results raise interesting questions: can directional information, crucial to tackle ImageNav, be learned by RL alone, and by comparably simple architectures? In this study we investigate the effect of architectural choices like late fusion, channel stacking and cross-attention, and find that: (i) Pre-training and early patch-wise fusion are essential for strong performance, compared to late fusion. (ii) Success of recent frugal channel stacking architectures is likely due to a simulator setting allowing agents to slide along obstacles. Interestingly, capabilities learned in this regime can be transferred to realistic settings if the transfer includes weights of perception network. (iii) Navigation and (emerging) relative pose estimation performance are correlated."
    authors={{
    "Gianluca Monaci":[],
    "Philippe Weinzaepfel":[],
    "Christian Wolf":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/19_What_matters_in_ImageNav_ar.pdf"
    />,
  <Paper
    title="Object Retrieval-Guided Vision Language Modeling for Embodied Interaction"
    abstract="Vision-language model (VLM)-based agents often struggle to name specific or unseen objects in hand-object interactions. We propose a zero-shot, real-time method that enhances VLM outputs by retrieving object features from a custom database and injecting prior knowledge into the captioning process during hand-object interactions. Our proposed approach enables users to guide an agent towards object-aware descriptions with task or job-specific objects, which are returned as speech output running in real time, as shown on GTEA and a smartphone-based user study with our collected dataset. The code is available on GitHub."
    authors={{
    "Constantin Patsch":[],
    "Yuankai Wu":[],
    "Marsil Zakour":[],
    "Eckehard Steinbach":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/22_Object_Retrieval_Guided_Vis.pdf"
    />,
  <Paper
    title="MotIF: Motion Instruction Fine-tuning"
    abstract="While success in many robotics tasks can be determined by only observing the final state and how it differs from the initial state -- e.g., if an apple is picked up -- many tasks require observing the full motion of the robot to correctly determine success. For example, brushing hair requires repeated strokes that correspond to the contours and type of hair. Prior works often use off-the-shelf vision-language models (VLMs) as success detectors; however, when success depends on the full trajectory, VLMs struggle to make correct judgments for two reasons. First, modern VLMs often use single frames, and thus cannot capture changes over a full trajectory. Second, even if we provide state-of-the-art VLMs with an input of multiple frames, they still fail to correctly detect success due to a lack of robot data. Our key idea is to fine-tune VLMs using abstract representations that are able to capture trajectory-level information such as the path the robot takes by overlaying keypoint trajectories on the final image. We propose motion instruction fine-tuning (MotIF), a method that fine-tunes VLMs using the aforementioned abstract representations to semantically ground the robot's behavior in the environment. To benchmark and fine-tune VLMs for robotic motion understanding, we introduce the MotIF-1K dataset containing 653 human and 369 robot demonstrations across 13 task categories with motion descriptions. MotIF assesses the success of robot motion given ask and motion instructions. Our model significantly outperforms state-of-the-art API-based single-frame VLMs and video LMs by at least twice in F1 score with high precision and recall, generalizing across unseen motions, tasks, and environments. Finally, we demonstrate practical applications of MotIF in ranking trajectories on how they align with task and motion descriptions. Dataset, code, and checkpoints are in https://motif-1k.github.io/"
    authors={{
    "Minyoung Hwang":[],
    "Joey Hejna":[],
    "Dorsa Sadigh":[],
    "Yonatan Bisk":[],
    }}
    affiliations={[]}
    pdf="/papers/2025/23_MotIF_Motion_Instruction_Fi.pdf"
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
        observations: "RGB-D, Temperature Sensors, Water Level",
        actionSpace: "Discrete",
        stochasticAcuation: "",
        winner: "",
      },
      {
        challenge: challengePageMap["ManiSkillViTac"],
        key: "maniskill-vitac",
        task: "Vision-Tactile Fusion Manipulation",
        interactiveActions: "✓",
        simulationPlatform: "SAPIEN",
        sceneDataset: "Customized Scenarios",
        observations: "RGB-D, Proproioception, Tactile Signals",
        actionSpace: "Continuous",
        stochasticAcuation: "",
        winner: "",
      },
      {
        challenge: challengePageMap["SMM"],
        key: "SMM",
        task: "Social Mobile Manipulation",
        interactiveActions: "✓",
        simulationPlatform: "Infinite World (based on Isaac Sim)",
        sceneDataset: "SMM Dataset",
        actionSpace: "Continuous",
        observations: "RGB-D",
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
      <Section title="Attending">
        <p>
          The Embodied AI workshop will be held in-person at CVPR 2025 in Nashville, Tennessee
          on June 12th from 9 to 5 CDT:
          <ul>
            <li><b>In-Person:</b> Workshop talks and panels will be held in room 101 D from 9-noon and 1:30-5 CDT.              
            </li>
            <li><b>Remote:</b>Zoom info for remote CVPR attendees can be found on our <a href="https://cvpr.thecvf.com/virtual/2025/workshop/32284">official CVPR workshop page</a>.
                Questions can be asked via Slack at<InlineSlack />
            </li>
            <li><b>Posters:</b> Posters will be in ExHall D from 12:00 PM to 1:30 PM CDT at boards #140 to #169.
            Oral presentations will be in room 101 D from 3:30-4:00 PM CDT.
            </li>
            <li><b>Printing:</b> Information on <a href="https://cvpr.thecvf.com/Conferences/2025/PosterPrintingInformation">poster printing</a> is available on CVPR's website.</li>
          </ul>
          For late-breaking updates from CVPR, see the workshop's <a href="https://cvpr.thecvf.com/virtual/2025/workshop/32284">CVPR page</a>.
          </p>
        <p>
          <Img fluid={data.workshopLocation.childImageSharp.fluid} alt="Workshop Location"/>
        </p>
      </Section>
          
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
      <Steps progressDot current={5} direction="vertical">
          <Step title="Workshop Announced" description="March 31st, 2025" />
          <Step
            title="Paper Submission Deadline"
            description="CLOSED - Friday May 23rd, 2025"
          />
          <Step
            title="Paper Notification Deadline"
            description="CLOSED - Monday June 4nd, 2025"
          />
          <Step
            title="Challenge Submission Deadlines"
            description="May-June 2025. Check each challenge for the specific date."
          />
          <Step
            title="Camera Ready Copy Deadline"
            description="Tuesday June 11th, 2025"
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
          <li><b>Workshop Talks: 9:00AM-5:00PM CDT - Room 101D</b></li>
          <li><b>Poster Session: 12:00PM-1:30PM CDT - ExHall D boards #140 to #169</b></li>
        </ul>
        Zoom information can be found for CVPR attendees on
        our <a href="https://cvpr.thecvf.com/virtual/2025/workshop/32284">official CVPR workshop page</a>.
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
                      <br/>
                      <Time time="9:00 - 9:10 AM CDT" />
                      <br />
                      Location: Room 101D
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
                      (ARNOLD, HAZARD, ManiSkill-ViTac, SMM)
                      <br />
                      <Time time="9:10 - 10:00 AM CDT" />
                      <br />
                      Location: Room 101D
                      <Speaker
                         organizations={["CSIRO"]}
                         name="Moderator - David Hall"
                         fixedImg={data.davidH.childImageSharp.fixed}
                         noMargin={true}
                      />
                      
                      <ul>
                        <li>9:10: <a href="https://sites.google.com/view/arnoldchallenge/">ARNOLD Challenge</a></li>
                        <li>9:20: <a href="https://embodied-agi.cs.umass.edu/hazard">HAZARD Challenge</a></li>
                        <li>9:30: <a href="https://ai-workshops.github.io/maniskill-vitac-challenge-2025/">ManiSkill-ViTac</a></li>
                        <li>9:40: <a href="https://smm-challenge.github.io/">SMM Challenge</a></li>
                      </ul>
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Challenge Q&A</b>
                      <br/>
                      <Time time="10:00 - 10:30 AM CDT" />
                      <br />
                      Location: Room 101D
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Invited Talk - Embodied AI Applications</b>
                      <br/>
                      <i>Title: Learning from Humans with Vision and Touch</i>
                      <br/>
                      <Time time="10:30 - 11:00 AM CDT" />
                      <br />
                      Location: Room 101D
                      <Speaker
                        organizations={["NYU"]}
                        name="Lerrel Pinto"
                        fixedImg={data.lerrelPinto.childImageSharp.fixed}
                        noMargin={true}
                      />
                      <p>Bio: Lerrel Pinto is an Assistant Professor of Computer Science at NYU Courant and part of the CILVR group. Lerrel runs the General-purpose Robotics and AI Lab (GRAIL) with the goal of getting robots to generalize and adapt in the messy world we live in.</p>
                      <Abstract
                        text="Abstract:  Despite rapid advances in robotics, robots still struggle to achieve the dexterity and adaptability of humans in real-world manipulation tasks. This talk explores how learning directly from humans—leveraging both vision and touch—can bridge this gap and unlock more robust, generalizable robot skills. I will present recent research that harnesses egocentric visual demonstrations, captured with wearable smart glasses, to extract robot-executable actions and enable closed-loop policy learning that generalizes across different robot morphologies and environments. Building on this, I will discuss new approaches for force-sensitive manipulation that combine vision-based hand pose estimation with tactile data from sensorized gloves, enabling robots to predict and control fine-grained contact forces with high precision. Finally, I will introduce AnySkin, a versatile and easily replaceable tactile sensor that supports cross-instance generalization of manipulation policies, making tactile learning scalable and practical for real-world deployment."
                        />                      
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Invited Talk - Foundation Models for Embodied AI </b>
                      <br/>
                      <i>Towards Multimodal Embodied AI Agents that Can See, Talk and Act</i>
                      <br/>
                      <Time time="11:00 - 11:30 AM CDT" />
                      <br />
                      Location: Room 101D
                      <Speaker
                        organizations={["Microsoft Research"]}
                        name="Jianwei Yang"
                        fixedImg={data.jianweiYang.childImageSharp.fixed}
                        noMargin={true}
                      />
                      <p>Bio: Jianwei Yang is a principal researcher in Deep Learning Group at Microsoft Research, Redmond, led by Jianfeng Gao. My research interests generally span in computer vision, multi-modality, and machine learning. Currently, I am focusing on building next-generation vision and multi-modal foundations.</p>
                      <Abstract
                        text="The development of multimodal AI agents marks a pivotal step toward creating systems capable of understanding, reasoning, and interacting with the world in human-like ways. Building such agents requires models that not only comprehend multi-sensory observations but also act adaptively to achieve goals within their environments. In this talk, I will present my research journey toward this grand goal across three key dimensions. First, I will explore how to bridge the gap between core vision understanding and multimodal learning through unified frameworks at various granularities. Next, I will discuss connecting vision-language models with large language models (LLMs) to create intelligent conversational systems. Finally, I will delve into recent advancements that extend multimodal LLMs into vision-language-action models, forming the foundation for general-purpose robotics policies. Together, these lead to an aspiration of building the next generation of multimodal and embodied AI agents capable of seeing, talking, and acting across diverse scenarios."
                        />                      
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Invited Talk - Simulation for Embodied AI</b>
                      <br/>
                      <i>Title: Geometry and Physics Bias in Embodied AI</i>
                      <br/>
                      <Time time="11:30 AM - 12:00 PM CDT" />
                      <br />
                      Location: Room 101D
                      <Speaker
                        organizations={["Caltech"]}
                        name="Jiayun (Peter) Wang"
                        fixedImg={data.jiayunWang.childImageSharp.fixed}
                        noMargin={true}
                      />
                      <p>Bio: Jiayun (Peter) Wang is a postdoctoral researcher at the California Institute of Technology, working with Prof. Anima Anandkumar. He received his PhD from UC Berkeley in 2023, advised by Prof. Stella Yu. His research develops novel machine learning and computer vision methodologies that address challenges of data scarcity and computational cost, with real-world applications like healthcare. More information can be found at his website: https://pwang.pw/. </p>
                      <Abstract
                        text="Abstract: Embodied AI demands agents that see the world with geometric fidelity, anticipate and interact with it with physical rigor. The talk will present a three-stage ladder—Perceive, Predict, Control—showing how carefully chosen geometry and physics biases enable that climb with minimal supervision. 1) Perceive. Pose-Aware Self-Supervised Learning learns semantic and geometric features from unlabeled videos. By regularizing along the agent’s own viewpoint trajectory, the network acquires a 3-D understanding without a single human label. 2) Predict and control. Controlling aerodynamic forces in turbulent conditions is crucial for UAV operation. We show AI enables realtime fluid flow prediction and turbulence control for wall friction reduction, which outperforms existing methods requiring expensive simulations of turbulent fluid dynamics. We further close the loop with FALCON, a model-based reinforcement learning framework for effective modeling and control of aerodynamic forces under turbulent flows. FALCON learns to control the underlying nonlinear dynamics when tested in the Caltech wind tunnel under highly turbulent conditions. Together, these works illustrate a unifying recipe: geometry grounds perception, physics grounds prediction and their composition unlocks fast, sample-efficient control."
                        />                      
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Lunch / Accepted Papers Poster Session</b>
                      <br />
                      <Time time="12:00 PM - 1:30 PM CDT" />
                      <br />
                      Location: ExHall D
                      <ul>
                       <li>EAI's posters will be at boards #140 to #169.</li>
                      </ul>
                    </Timeline.Item>
                    
                    <Timeline.Item>
                      <b>Invited Talk - Robotics and Embodied AI</b>
                      <br />
                      <i>Title: The Ingredients for Efficient Robot Learning and Exploration</i>
                      <br />
                      <Time time="1:30 - 2:00 PM CDT" />
                      <br />
                      Location: Room 101D
                      <Speaker
                        organizations={["University of Cambridge"]}
                        name="Rika Antonova"
                        fixedImg={data.rikaAntonova.childImageSharp.fixed}
                        noMargin={true}
                      />
                      <p>Bio: Rika Antonova is an Associate Professor at the University of Cambridge. Her research interests include data-efficient reinforcement learning algorithms, robotics, active learning & exploration​. Earlier, Rika was a postdoctoral scholar at Stanford University upon receiving the Computing Innovation Fellowship from the US National Science Foundation. Rikacompleted her PhD at KTH, and earlier she obtained a research Master's degree from the Robotics Institute at Carnegie Mellon University. Before that, Rika was a senior software engineer at Google.</p>
                      <Abstract
                        text="Abstract: In this talk, I will outline the ingredients for enabling efficient robot learning. First, I will demonstrate how large vision-language models can enhance scene understanding and generalization, allowing robots to learn general rules from specific examples for handling everyday objects. Next, I will describe methods for leveraging equivariance to significantly reduce the amount of training data needed for learning from human demonstrations. Moving beyond demonstrations, I will discuss how simulation can enable robots to learn autonomously. I will describe the challenges and opportunities of aligning differentiable simulators with reality, and also introduce methods for facilitating reinforcement learning with 'black-box' simulators. To further expand robot capabilities we need adaptive hardware. I will demonstrate how differentiable simulation can be used for learning tool morphology to automatically adapt tools for robots. I will also outline experiments with new affordable and robust sensors. Finally, I will share plans for our new project on co-design of hardware and policy learning, which will leverage global optimization, rapid prototyping, and real-to-sim transfer to jointly search the vast space of hardware designs and reinforcement learning methods."
                        />
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Invited Talk - Foundation Models for Embodied AI</b>
                      <br />
                      <i>Title: Large Behavior Models for Dexterous Manipulation</i>
                      <br />
                      <Time time="2:00 - 2:30 PM CDT" />
                      <br />
                      Location: Room 101D
                      <Speaker
                        organizations={["TRI"]}
                        name="Rareș Ambruș"
                        fixedImg={data.raresAmbrus.childImageSharp.fixed}
                        noMargin={true}
                      />
                      <p>Bio: Dr. Rareș Ambruș is a senior manager in the Large Behavior Models division at Toyota Research Institute (TRI). His research interests lie at the intersection of robotics, computer vision and machine learning with the aim of discovering visual representations for embodied applications in areas such as automated driving and robotics. Dr. Ambruș received his Ph.D. in 2017 from the Royal Institute of Technology (KTH), Sweden, focusing on self-supervised perception and mapping for mobile robots. He has more than 100 publications and patents at top AI venues covering fundamental topics in computer vision, machine learning and robotics.</p>
                      <Abstract
                        text="Abstract: Dexterous manipulation has seen tremendous progress in recent years, with imitation learning policies enabling successful performance of dexterous and hard-to-model tasks. Concurrently, scaling data and model size has led to the development of capable language and vision foundation models, motivating large-scale efforts to create general-purpose robot foundation models. In this talk, I'll describe our efforts at TRI at building Large Behavior Models: multi-task visuomotor policies for scalable dexterous manipulation. I’ll talk about some of our latest results when deploying these models for complex, dexterous and long horizon tasks and I’ll highlight the challenges associated with rigorous evaluation in the real world as well as some of the tools and experimental protocols we’ve built in order to measure progress in the real-world with confidence."
                        />                      
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Invited Talk - Generative AI for Embodied AI</b>
                      <br />
                      <i>Title: World Models at Scale for Embodied Driving</i>
                      <br />
                      <Time time="2:30 - 3:00 PM CDT" />
                      <br />
                      Location: Room 101D
                      <Speaker
                        organizations={["Wayve"]}
                        name="Nikhil Mohan"
                        fixedImg={data.nikhilMohan.childImageSharp.fixed}
                        noMargin={true}
                      />
                      <p>Bio: Nikhil Mohan is a Lead Scientist at Wayve, where he focuses on leveraging data-driven techniques for simulation in autonomous driving. His work spans Neural Radiance Fields (NeRFs), Gaussian Splatting, and generative models, emphasizing their application to improve and evaluate Wayve’s AI Driver performance. Before turning his attention to simulation, Nikhil led Wayve’s production driving team, where they shipped research prototypes into the production system. Prior to joining Wayve, he earned his Master’s degree at Carnegie Mellon University, concentrating in machine learning and signal processing.</p>
                      <Abstract
                        text="Abstract: Nikhil's talk will focus on using World Models to produce data at scale for Embodied AI in the context of self driving."
                        />
                    </Timeline.Item>
                   <Timeline.Item>
                      <b>Invited Talk - Generative AI for Embodied AI</b>
                      <br />
                      <i>Title: Cosmos-Drive-Dreams: Scalable Synthetic Driving Data Generation with World Foundation Models</i>
                      <br />
                      <Time time="3:00 - 3:30 PM CDT" />
                      <Speaker
                        organizations={["NVIDIA"]}
                        name="Huan Ling"
                        fixedImg={data.huanLing.childImageSharp.fixed}
                        noMargin={true}
                      />
                      <p>Bio: Huan Ling is a Senior Research Scientist at NVIDIA’s Spatial Intelligence (TorontoAI) Lab. His research focuses on developing foundational generative models that enable realistic and controllable environments—spanning video synthesis,  3D/4D scene generation and reconstruction. His work aims for building scalable systems that support real world applications.  Huan’s research has been featured at top conferences such as CVPR and NeurIPS, and he actively collaborates across disciplines to advance the frontier of generative AI for real-world applications. He has contributed to the development and large-scale training of video foundation model products, including NVIDIA-COSMOS and COSMOS-Drive-Dreams, which enable high-fidelity, controllable video generation for physicalAI related scenarios like autonomous driving.</p>
                      <Abstract
                        text="Abstract: Collecting and annotating real-world data for safety-critical physical AI systems, such as Autonomous Vehicle (AV), is time-consuming and costly. It is especially challenging to capture rare edge cases, which play a critical role in training and testing of an AV system. To address this challenge, we introduce the Cosmos-Drive-Dreams - a synthetic data generation (SDG) pipeline that aims to generate challenging scenarios to facilitate downstream tasks such as perception and driving policy training. Powering this pipeline is Cosmos-Drive-Dreams, a suite of models specialized from NVIDIA Cosmos world foundation model for the driving domain and are capable of controllable, high-fidelity, multi-view, and spatiotemporally consistent driving video generation. We showcase the utility of these models by applying Cosmos-Drive-Dreams to scale the quantity and diversity of driving datasets with high-fidelity and challenging scenarios. Experimentally, we demonstrate that our generated data helps in mitigating long-tail distribution problems and enhances generalization in downstream tasks such as 3D lane detection, 3D object detection and driving policy learning. We open source our model weights through the NVIDIA’s Cosmos platform, pipeline toolkit, and a synthetic dataset which consists of 79,880 clips."
                        />                      
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Accepted Paper Highlights</b>
                      <br />
                      <Time time="3:30 - 4:00 PM CDT" />
                      <br />
                      <ul>
                      <li>
                      #2: On the use of Pre-trained Visual Representations in Visuo-Motor Robot Learning
                      </li>
                      <li>
                      #6: R-EQA: Retrieval-Augmented Generation for Embodied Question Answering
                      </li>
                      <li>
                      #7: Uncertainty Modeling in Autonomous Vehicle Trajectory Prediction: A Comprehensive Survey
                      </li>
                      <li>
                      #15: Benchmarking Arbitrary Natural Language Tasks in 3D Open Worlds
                      </li>
                      <li>
                      #19: What matters in ImageNav: architecture, pre-training, sim settings, pose
                      </li>
                      <li>
                      #23: MotIF: Motion Instruction Fine-tuning
                      </li>
                      </ul>

                      <Speaker
                         organizations={["CSIRO"]}
                         name="Moderator - David Hall"
                         fixedImg={data.davidH.childImageSharp.fixed}
                         noMargin={true}
                      />
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Invited Speaker Panel</b>
                      <br />
                      <Time time="4:00 - 4:30 PM CDT" />
                      <br />
                      <Speaker
                         organizations={["Logical Robotics"]}
                         name="Moderator - Anthony Francis"
                         fixedImg={data.anthony.childImageSharp.fixed}
                         noMargin={true}
                      />
                    </Timeline.Item>

                    <Timeline.Item>
                      <b>Debate on the Future of Embodied AI</b>
                      <br />
                      <Time time="4:30 - 5:00 PM CDT" />
                      <br />
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
                      <Time time="5:00 PM CDT" />
                    </Timeline.Item>
                  </Timeline>
                </div>
      </Section>
      <Section title="Sponsor Events">
        <p>
        <ul>
          <li><b>NVIDIA:</b> Check the <a href={"https://www.nvidia.com/en-us/events/cvpr/"} target="_blank">NVIDIA event page</a>{" "} for the full list of events sponsored by NVIDIA at CVPR.
          Also, remember to checkout the <a href={"https://events.nvidia.com/nvcvprresearchercelebration"} target="_blank">NVIDIA party!</a>{" "}
          </li>
          
        </ul>
          
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
            The submission deadline CLOSED on <b>May 23rd</b> (
            Anywhere on Earth - for clarity, 2025/05/24 00:01 in GMT as computed by OpenReview).
            Papers should be no longer than 2 pages (excluding references) and styled
            in the{" "}
            <a href="https://cvpr.thecvf.com/Conferences/2025/AuthorGuidelines" target="_blank">
              CVPR format
            </a>.
            <ul>
              <li>
              <a href="https://openreview.net/group?id=thecvf.com/CVPR/2025/Workshop/EAI">
              Paper submissions are CLOSED as of May 23rd, 2025.
              </a>
              </li>
              <li>
              Notifications were sent on June 4th, 2025.
              {/* The <a href="https://openreview.net/group?id=thecvf.com/CVPR/2023/Workshop/EAI">paper submission link is LIVE.</a> */}
              </li>
              <li>
              Camera-ready copies of accepted papers are due by June 11th, 2025.
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
            <img src="/images/sponsors/logical-robotics.png" height="60" alt="Logical Robotics"/>
          </a>

          <a href="https://microsoft.com/">
            <img src="/images/sponsors/microsoft-logo.png" height="200" alt="Microsoft"/>
          </a>

          <a href="https://www.nvidia.com/">
            <img src="/images/sponsors/nvidia.svg" height="75" alt="NVIDIA"/>
          </a>

          <a href="https://wayve.ai/">
            <img src="/images/sponsors/wayve.webp" height="65" alt="Wayve"/>
          </a>

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
    huanLing: file(relativePath: { eq: "cvpr2025/huan-ling.png" }) {
      ...FaceThumbnail
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
