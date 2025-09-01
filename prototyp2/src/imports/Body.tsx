import svgPaths from "./svg-gqh9xq5srf";
import imgPhoto from "figma:asset/1d3614c5fd4353e160d5b20b5a191b015d91f70c.png";
import imgPhoto1 from "figma:asset/5115964c61b7457cb5b490bed21f67873b7df269.png";
import imgPhoto2 from "figma:asset/2866f5ac6af999415a2380dd0b1c4b842f9143d5.png";
import imgPhoto3 from "figma:asset/8aea95ca4c3461524761af96f5d4f42cae026dbd.png";
import imgPhoto4 from "figma:asset/09de5526b4ed66aa6126978e71d259f3b139afea.png";
import imgPhoto5 from "figma:asset/6738de4ed64986151c3596b9fc34c8090965ae60.png";
import imgPhoto6 from "figma:asset/66da9ba465fd7c0c4c4ac86a5de946bdd173293a.png";
import imgPhoto7 from "figma:asset/288db3b3002f54ac97feb00a5e89cf5a04cb4d30.png";
import imgVector from "figma:asset/1b6b025ed4d202ecaf09bca8cf68309160e2bd96.png";
import imgVector1 from "figma:asset/6ee51a835696441c9f363903f15465b26fa8d141.png";
import imgSubtract from "figma:asset/d4034f09bf1b27e4054fdb7f5fe6ec92823e003d.png";

function Text() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-1.5 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#171a26] text-[24px] tracking-[0.12px] w-full">
        <p className="leading-[32px]">Add Project</p>
      </div>
    </div>
  );
}

function GreyButton() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-[108px]" data-name="Grey Button">
      <div className="box-border content-stretch flex gap-1.5 items-center justify-center overflow-clip px-4 py-3 relative w-[108px]">
        <div className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#69686d] text-[14px] text-nowrap tracking-[0.07px]">
          <p className="leading-[20px] whitespace-pre">Cancel</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d0d2] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function BlackButton() {
  return (
    <div className="box-border content-stretch flex gap-1.5 items-center justify-center overflow-clip px-4 py-3 relative rounded-[12px] shrink-0 w-[109px]" data-name="Black Button" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 109 44\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><g transform=\\\'matrix(-7.2615 4.4 -11.618 -6.7422 72.615 0.0000038077)\\\' opacity=\\\'1\\\'><rect height=\\\'76.656\\\' width=\\\'68.541\\\' fill=\\\'url(%23grad)\\\' id=\\\'quad\\\' shape-rendering=\\\'crispEdges\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(1 -1)\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(-1 1)\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(-1 -1)\\\'/></g><defs><linearGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' x2=\\\'5\\\' y2=\\\'5\\\'><stop stop-color=\\\'rgba(77,77,77,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(46,46,46,1)\\\' offset=\\\'0.5\\\'/><stop stop-color=\\\'rgba(31,31,31,1)\\\' offset=\\\'0.75\\\'/><stop stop-color=\\\'rgba(16,16,16,1)\\\' offset=\\\'1\\\'/></linearGradient></defs></svg>')" }}>
      <div className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[14px] text-nowrap text-white tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Submit</p>
      </div>
    </div>
  );
}

function Right() {
  return (
    <div className="content-stretch flex gap-2.5 items-start justify-start relative shrink-0" data-name="Right">
      <GreyButton />
      <BlackButton />
    </div>
  );
}

function PageTitle() {
  return (
    <div className="content-stretch flex gap-6 items-center justify-start relative shrink-0 w-full" data-name="Page Title">
      <Text />
      <Right />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full" data-name="Label">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#4b4a4d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Project Name</p>
      </div>
    </div>
  );
}

function TypingArea() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px overflow-clip relative shrink-0" data-name="Typing Area">
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#69686d] text-[14px] text-nowrap tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Type project name</p>
      </div>
    </div>
  );
}

function MediumTextField() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Medium Text Field">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-1 items-center justify-start px-4 py-3 relative w-full">
          <TypingArea />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function WithLabelTextField() {
  return (
    <div className="content-stretch flex flex-col gap-1.5 items-start justify-start relative shrink-0 w-full" data-name="With Label_Text Field">
      <Label />
      <MediumTextField />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full" data-name="Label">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#4b4a4d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Description</p>
      </div>
    </div>
  );
}

function TypingArea1() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow h-[140px] items-start justify-start min-h-px min-w-px overflow-clip relative shrink-0" data-name="Typing Area">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#69686d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Type description. . .</p>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Text Area">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-1 items-center justify-start px-4 py-3 relative w-full">
          <TypingArea1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function WithLabelTextArea() {
  return (
    <div className="content-stretch flex flex-col gap-1.5 items-start justify-start relative shrink-0 w-full" data-name="With Label_Text Area">
      <Label1 />
      <TextArea />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full" data-name="Label">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#4b4a4d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Due Date</p>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div className="relative shrink-0 size-5" data-name="Calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Calendar">
          <path d={svgPaths.p31324000} id="Vector" stroke="var(--stroke-0, #69686D)" strokeWidth="1.5" />
          <path d="M5.83333 3.33333V2.08333" id="Vector_2" stroke="var(--stroke-0, #69686D)" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M14.1667 3.33333V2.08333" id="Vector_3" stroke="var(--stroke-0, #69686D)" strokeLinecap="round" strokeWidth="1.5" />
          <path d="M2.08333 7.5H17.9167" id="Vector_4" stroke="var(--stroke-0, #69686D)" strokeLinecap="round" strokeWidth="1.5" />
          <g id="Vector_5">
            <path d={svgPaths.p3e32ef00} fill="var(--fill-0, #69686D)" />
            <path d={svgPaths.p1f34f600} fill="var(--fill-0, #69686D)" />
          </g>
          <g id="Vector_6">
            <path d={svgPaths.p1e444e40} fill="var(--fill-0, #69686D)" />
            <path d={svgPaths.p5177180} fill="var(--fill-0, #69686D)" />
          </g>
          <g id="Vector_7">
            <path d={svgPaths.p109b1280} fill="var(--fill-0, #69686D)" />
            <path d={svgPaths.p28f13a00} fill="var(--fill-0, #69686D)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TypingArea2() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px overflow-clip relative shrink-0" data-name="Typing Area">
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#69686d] text-[14px] text-nowrap tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Select Dates</p>
      </div>
    </div>
  );
}

function MediumDatepicker() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Medium Datepicker">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-1.5 items-center justify-start px-4 py-3 relative w-full">
          <Calendar />
          <TypingArea2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function WithLabelDatepicker() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-1.5 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="With Label_Datepicker">
      <Label2 />
      <MediumDatepicker />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full" data-name="Label">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#4b4a4d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Client</p>
      </div>
    </div>
  );
}

function TypingArea3() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px overflow-clip relative shrink-0" data-name="Typing Area">
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#69686d] text-[14px] text-nowrap tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Select client. . .</p>
      </div>
    </div>
  );
}

function AltArrowDown() {
  return (
    <div className="relative shrink-0 size-5" data-name="Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Alt Arrow Down">
          <path d={svgPaths.p22504d80} id="Vector" stroke="var(--stroke-0, #69686D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="box-border content-stretch flex gap-2 items-center justify-center p-[8px] relative shrink-0 size-5" data-name="Icon">
      <AltArrowDown />
    </div>
  );
}

function MediumSelectOption() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Medium Select Option">
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-1.5 items-center justify-center px-4 py-3 relative w-full">
          <TypingArea3 />
          <Icon />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function WithLabelSelectOption() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-1.5 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="With Label_Select Option">
      <Label3 />
      <MediumSelectOption />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex gap-4 items-start justify-start relative shrink-0 w-full" data-name="Form">
      <WithLabelDatepicker />
      <WithLabelSelectOption />
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full" data-name="Label">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#4b4a4d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Budget</p>
      </div>
    </div>
  );
}

function AltArrowDown1() {
  return (
    <div className="relative shrink-0 size-5" data-name="Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Alt Arrow Down">
          <path d={svgPaths.p22504d80} id="Vector" stroke="var(--stroke-0, #69686D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex gap-1 items-center justify-start overflow-clip relative shrink-0" data-name="Label">
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#69686d] text-[14px] text-nowrap tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">USD</p>
      </div>
      <AltArrowDown1 />
    </div>
  );
}

function TypingArea4() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px overflow-clip relative shrink-0" data-name="Typing Area">
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#69686d] text-[14px] text-nowrap tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Type budget. . .</p>
      </div>
    </div>
  );
}

function MediumTextFieldSelect() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Medium Text Field + Select">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-2 items-center justify-start px-4 py-3 relative w-full">
          <Label5 />
          <div className="flex flex-row items-center self-stretch">
            <div className="h-full relative shrink-0 w-0" data-name="Div">
              <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 20">
                  <path d="M1 0V20" id="Div" stroke="var(--stroke-0, #F0F0F0)" />
                </svg>
              </div>
            </div>
          </div>
          <TypingArea4 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function WithLabelTextFieldSelect() {
  return (
    <div className="content-stretch flex flex-col gap-1.5 items-start justify-start relative shrink-0 w-full" data-name="With Label _Text Field + Select">
      <Label4 />
      <MediumTextFieldSelect />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start overflow-clip relative shrink-0 w-full z-[1]" data-name="Body">
      <WithLabelTextField />
      <WithLabelTextArea />
      <Form />
      <WithLabelTextFieldSelect />
    </div>
  );
}

function Form1() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="Form">
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 isolate items-center justify-start p-[24px] relative w-full">
          <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#171a26] text-[18px] tracking-[0.09px] w-full z-[2]">
            <p className="leading-[28px]">General Information</p>
          </div>
          <Body />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full" data-name="Label">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#4b4a4d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Files</p>
      </div>
    </div>
  );
}

function BlackButton1() {
  return (
    <div className="box-border content-stretch flex gap-1.5 items-center justify-center overflow-clip px-4 py-3 relative rounded-[12px] shrink-0" data-name="Black Button" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 88 44\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><g transform=\\\'matrix(-5.8625 4.4 -9.3798 -6.7422 58.625 0.0000038077)\\\' opacity=\\\'1\\\'><rect height=\\\'76.656\\\' width=\\\'68.541\\\' fill=\\\'url(%23grad)\\\' id=\\\'quad\\\' shape-rendering=\\\'crispEdges\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(1 -1)\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(-1 1)\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(-1 -1)\\\'/></g><defs><linearGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' x2=\\\'5\\\' y2=\\\'5\\\'><stop stop-color=\\\'rgba(77,77,77,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(46,46,46,1)\\\' offset=\\\'0.5\\\'/><stop stop-color=\\\'rgba(31,31,31,1)\\\' offset=\\\'0.75\\\'/><stop stop-color=\\\'rgba(16,16,16,1)\\\' offset=\\\'1\\\'/></linearGradient></defs></svg>')" }}>
      <div className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[14px] text-nowrap text-white tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Add File</p>
      </div>
    </div>
  );
}

function WithLabelFileUpload() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full" data-name="With Label_File Upload">
      <Label6 />
      <BlackButton1 />
    </div>
  );
}

function Body1() {
  return (
    <div className="content-stretch flex flex-col gap-3.5 items-start justify-start overflow-clip relative shrink-0 w-full z-[1]" data-name="Body">
      <WithLabelFileUpload />
    </div>
  );
}

function Form2() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="Form">
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 isolate items-center justify-start p-[24px] relative w-full">
          <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#171a26] text-[18px] tracking-[0.09px] w-full z-[2]">
            <p className="leading-[28px]">Resources</p>
          </div>
          <Body1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Magnifer() {
  return (
    <div className="relative shrink-0 size-5" data-name="Magnifer">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_18_5186)" id="Magnifer">
          <circle cx="9.58333" cy="9.58333" id="Vector" r="7.91667" stroke="var(--stroke-0, #69686D)" strokeWidth="1.5" />
          <path d={svgPaths.p2cf71ee0} id="Vector_2" stroke="var(--stroke-0, #69686D)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_18_5186">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TypingArea5() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px overflow-clip relative shrink-0" data-name="Typing Area">
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#69686d] text-[14px] text-nowrap tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Search members. . .</p>
      </div>
    </div>
  );
}

function MediumTextFieldIcon() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Medium Text Field + Icon">
      <div className="flex flex-row items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-1.5 items-center justify-start px-4 py-3 relative w-full">
          <Magnifer />
          <TypingArea5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Avatar() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Avatar">
      <div className="bg-[#e8e8e9] bg-size-[109.91%_165%,auto] rounded-[100px] shrink-0 size-10" data-name="photo" style={{ backgroundImage: `url('${imgPhoto}')` }} />
    </div>
  );
}

function Name() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0" data-name="Name">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0 text-[#171a26] text-[14px] tracking-[0.07px] w-full">
        <p className="leading-[20px]">Jay Hargudson</p>
      </div>
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#69686d] text-[12px] tracking-[0.06px] w-full">
        <p className="leading-[18px]">Project Manager</p>
      </div>
    </div>
  );
}

function User() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="User">
      <Avatar />
      <Name />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox">
      <div className="absolute bg-white inset-0 rounded-[6px]" data-name="Check">
        <div aria-hidden="true" className="absolute border-[#bababc] border-[1.75px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function User1() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="User">
      <User />
      <Checkbox />
    </div>
  );
}

function Avatar1() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Avatar">
      <div className="bg-[#e8e8e9] bg-size-[86.65%_130%,auto] rounded-[100px] shrink-0 size-10" data-name="photo" style={{ backgroundImage: `url('${imgPhoto1}')` }} />
    </div>
  );
}

function Name1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0" data-name="Name">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0 text-[#171a26] text-[14px] tracking-[0.07px] w-full">
        <p className="leading-[20px]">Mohammad Karim</p>
      </div>
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#69686d] text-[12px] tracking-[0.06px] w-full">
        <p className="leading-[18px]">Project Manager</p>
      </div>
    </div>
  );
}

function User2() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="User">
      <Avatar1 />
      <Name1 />
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox">
      <div className="absolute bg-white inset-0 rounded-[6px]" data-name="Check">
        <div aria-hidden="true" className="absolute border-[#bababc] border-[1.75px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function User3() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="User">
      <User2 />
      <Checkbox1 />
    </div>
  );
}

function Avatar2() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Avatar">
      <div className="bg-[#e8e8e9] bg-size-[172.38%_115%,auto] rounded-[100px] shrink-0 size-10" data-name="photo" style={{ backgroundImage: `url('${imgPhoto2}')` }} />
    </div>
  );
}

function Name2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0" data-name="Name">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0 text-[#171a26] text-[14px] tracking-[0.07px] w-full">
        <p className="leading-[20px]">John Bushmill</p>
      </div>
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#69686d] text-[12px] tracking-[0.06px] w-full">
        <p className="leading-[18px]">Project Manager</p>
      </div>
    </div>
  );
}

function User4() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="User">
      <Avatar2 />
      <Name2 />
    </div>
  );
}

function Checkbox2() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox">
      <div className="absolute bg-white inset-0 rounded-[6px]" data-name="Check">
        <div aria-hidden="true" className="absolute border-[#bababc] border-[1.75px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function User5() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="User">
      <User4 />
      <Checkbox2 />
    </div>
  );
}

function Avatar3() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Avatar">
      <div className="bg-[#e8e8e9] bg-[position:50%_25%,_0%_0%] bg-size-[168.68%_112.5%,auto] rounded-[100px] shrink-0 size-10" data-name="photo" style={{ backgroundImage: `url('${imgPhoto3}')` }} />
    </div>
  );
}

function Name3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0" data-name="Name">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0 text-[#171a26] text-[14px] tracking-[0.07px] w-full">
        <p className="leading-[20px]">Josh Adam</p>
      </div>
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#69686d] text-[12px] tracking-[0.06px] w-full">
        <p className="leading-[18px]">UI/UX Designer</p>
      </div>
    </div>
  );
}

function User6() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="User">
      <Avatar3 />
      <Name3 />
    </div>
  );
}

function Checkbox3() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox">
      <div className="absolute bg-white inset-0 rounded-[6px]" data-name="Check">
        <div aria-hidden="true" className="absolute border-[#bababc] border-[1.75px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function User7() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="User">
      <User6 />
      <Checkbox3 />
    </div>
  );
}

function Avatar4() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Avatar">
      <div className="bg-[#e8e8e9] bg-[position:50%_0%,_0%_0%] bg-size-[91.41%_115%,auto] rounded-[100px] shrink-0 size-10" data-name="photo" style={{ backgroundImage: `url('${imgPhoto4}')` }} />
    </div>
  );
}

function Name4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0" data-name="Name">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0 text-[#171a26] text-[14px] tracking-[0.07px] w-full">
        <p className="leading-[20px]">Linda Blair</p>
      </div>
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#69686d] text-[12px] tracking-[0.06px] w-full">
        <p className="leading-[18px]">Mobile Developer</p>
      </div>
    </div>
  );
}

function User8() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="User">
      <Avatar4 />
      <Name4 />
    </div>
  );
}

function Checkbox4() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox">
      <div className="absolute bg-white inset-0 rounded-[6px]" data-name="Check">
        <div aria-hidden="true" className="absolute border-[#bababc] border-[1.75px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function User9() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="User">
      <User8 />
      <Checkbox4 />
    </div>
  );
}

function Avatar5() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Avatar">
      <div className="bg-[#e8e8e9] bg-size-[126.93%_84.37%,auto] rounded-[100px] shrink-0 size-10" data-name="photo" style={{ backgroundImage: `url('${imgPhoto5}')` }} />
    </div>
  );
}

function Name5() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0" data-name="Name">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0 text-[#171a26] text-[14px] tracking-[0.07px] w-full">
        <p className="leading-[20px]">Jessica Patricia</p>
      </div>
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#69686d] text-[12px] tracking-[0.06px] w-full">
        <p className="leading-[18px]">Front End Developer</p>
      </div>
    </div>
  );
}

function User10() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="User">
      <Avatar5 />
      <Name5 />
    </div>
  );
}

function Checkbox5() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox">
      <div className="absolute bg-white inset-0 rounded-[6px]" data-name="Check">
        <div aria-hidden="true" className="absolute border-[#bababc] border-[1.75px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function User11() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="User">
      <User10 />
      <Checkbox5 />
    </div>
  );
}

function Avatar6() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Avatar">
      <div className="bg-[#e8e8e9] bg-size-[172.5%_115%,auto] rounded-[100px] shrink-0 size-10" data-name="photo" style={{ backgroundImage: `url('${imgPhoto6}')` }} />
    </div>
  );
}

function Name6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0" data-name="Name">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0 text-[#171a26] text-[14px] tracking-[0.07px] w-full">
        <p className="leading-[20px]">Laura Prichet</p>
      </div>
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#69686d] text-[12px] tracking-[0.06px] w-full">
        <p className="leading-[18px]">Back End Developer</p>
      </div>
    </div>
  );
}

function User12() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="User">
      <Avatar6 />
      <Name6 />
    </div>
  );
}

function Checkbox6() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox">
      <div className="absolute bg-white inset-0 rounded-[6px]" data-name="Check">
        <div aria-hidden="true" className="absolute border-[#bababc] border-[1.75px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function User13() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="User">
      <User12 />
      <Checkbox6 />
    </div>
  );
}

function Avatar7() {
  return (
    <div className="content-stretch flex flex-col items-end justify-start relative shrink-0" data-name="Avatar">
      <div className="bg-[#e8e8e9] bg-size-[135%_90%,auto] rounded-[100px] shrink-0 size-10" data-name="photo" style={{ backgroundImage: `url('${imgPhoto7}')` }} />
    </div>
  );
}

function Name7() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0" data-name="Name">
      <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0 text-[#171a26] text-[14px] tracking-[0.07px] w-full">
        <p className="leading-[20px]">Lisa Greg</p>
      </div>
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[#69686d] text-[12px] tracking-[0.06px] w-full">
        <p className="leading-[18px]">Tech Lead</p>
      </div>
    </div>
  );
}

function User14() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="User">
      <Avatar7 />
      <Name7 />
    </div>
  );
}

function Checkbox7() {
  return (
    <div className="relative shrink-0 size-5" data-name="Checkbox">
      <div className="absolute bg-white inset-0 rounded-[6px]" data-name="Check">
        <div aria-hidden="true" className="absolute border-[#bababc] border-[1.75px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      </div>
    </div>
  );
}

function User15() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="User">
      <User14 />
      <Checkbox7 />
    </div>
  );
}

function ScrollbarTrack() {
  return (
    <div className="absolute bg-[#f0f0f0] bottom-0 content-stretch flex gap-2 items-start justify-start overflow-clip right-[-16px] top-0" data-name="Scrollbar Track">
      <div className="h-[54px] shrink-0 w-1" data-name="Thumb" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 4 54\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><g transform=\\\'matrix(-0.26648 5.4 -0.42635 -8.2745 2.6648 0.0000046731)\\\' opacity=\\\'1\\\'><rect height=\\\'76.656\\\' width=\\\'68.541\\\' fill=\\\'url(%23grad)\\\' id=\\\'quad\\\' shape-rendering=\\\'crispEdges\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(1 -1)\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(-1 1)\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(-1 -1)\\\'/></g><defs><linearGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' x2=\\\'5\\\' y2=\\\'5\\\'><stop stop-color=\\\'rgba(147,194,253,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(111,171,254,1)\\\' offset=\\\'0.25\\\'/><stop stop-color=\\\'rgba(74,148,254,1)\\\' offset=\\\'0.5\\\'/><stop stop-color=\\\'rgba(38,126,255,1)\\\' offset=\\\'0.75\\\'/><stop stop-color=\\\'rgba(19,114,255,1)\\\' offset=\\\'0.875\\\'/><stop stop-color=\\\'rgba(1,103,255,1)\\\' offset=\\\'1\\\'/></linearGradient></defs></svg>')" }} />
    </div>
  );
}

function Users() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-full" data-name="Users">
      <User1 />
      <User3 />
      <User5 />
      <User7 />
      <User9 />
      <User11 />
      <User13 />
      <User15 />
      <ScrollbarTrack />
    </div>
  );
}

function TeamMembers() {
  return (
    <div className="bg-[#f8f8fa] relative rounded-[16px] shrink-0 w-full z-[1]" data-name="Team Members">
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-center justify-start p-[16px] relative w-full">
          <MediumTextFieldIcon />
          <Users />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Form3() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-[756px]" data-name="Form">
      <div className="box-border content-stretch flex flex-col gap-5 isolate items-center justify-start overflow-clip p-[24px] relative w-[756px]">
        <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#171a26] text-[18px] tracking-[0.09px] w-full z-[2]">
          <p className="leading-[28px]">Team Members</p>
        </div>
        <TeamMembers />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function LeftCol() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="Left Col">
      <Form1 />
      <Form2 />
      <Form3 />
    </div>
  );
}

function Label7() {
  return (
    <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full" data-name="Label">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#69686d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Image</p>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div className="overflow-clip relative shrink-0 size-5" data-name="Gallery">
      <div className="absolute bottom-[58.33%] left-[58.33%] right-1/4 top-1/4" data-name="Vector">
        <img className="block max-w-none size-full" height="3.333" src={imgVector} width="3.333" />
      </div>
      <div className="absolute inset-[5.208%]" data-name="Vector">
        <img className="block max-w-none size-full" height="17.917" src={imgVector1} width="17.917" />
      </div>
      <div className="absolute inset-[47.49%_14.14%_11.46%_11.46%] opacity-40" data-name="Subtract">
        <img className="block max-w-none size-full" height="8.21" src={imgSubtract} width="14.88" />
      </div>
    </div>
  );
}

function OpacityCircleIconBagde() {
  return (
    <div className="bg-[#e6f0ff] box-border content-stretch flex gap-2 items-center justify-center overflow-clip p-[8px] relative rounded-[100px] shrink-0 size-11" data-name="Opacity Circle Icon Bagde">
      <Gallery />
    </div>
  );
}

function BlackButton2() {
  return (
    <div className="box-border content-stretch flex gap-1.5 items-center justify-center overflow-clip px-4 py-3 relative rounded-[12px] shrink-0" data-name="Black Button" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 107 44\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><g transform=\\\'matrix(-7.1282 4.4 -11.405 -6.7422 71.282 0.0000038077)\\\' opacity=\\\'1\\\'><rect height=\\\'76.656\\\' width=\\\'68.541\\\' fill=\\\'url(%23grad)\\\' id=\\\'quad\\\' shape-rendering=\\\'crispEdges\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(1 -1)\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(-1 1)\\\'/><use href=\\\'%23quad\\\' transform=\\\'scale(-1 -1)\\\'/></g><defs><linearGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' x2=\\\'5\\\' y2=\\\'5\\\'><stop stop-color=\\\'rgba(77,77,77,1)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(46,46,46,1)\\\' offset=\\\'0.5\\\'/><stop stop-color=\\\'rgba(31,31,31,1)\\\' offset=\\\'0.75\\\'/><stop stop-color=\\\'rgba(16,16,16,1)\\\' offset=\\\'1\\\'/></linearGradient></defs></svg>')" }}>
      <div className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[14px] text-nowrap text-white tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Add Image</p>
      </div>
    </div>
  );
}

function MediaUpload() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Media Upload">
      <div className="flex flex-col items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-center justify-center p-[20px] relative w-full">
          <OpacityCircleIconBagde />
          <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] min-w-full relative shrink-0 text-[#69686d] text-[14px] text-center tracking-[0.07px]" style={{ width: "min-content" }}>
            <p className="leading-[20px]">Drag and drop image here, or click add image</p>
          </div>
          <BlackButton2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function WithLabelMediaUpload() {
  return (
    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative shrink-0 w-full z-[1]" data-name="With Label_Media Upload">
      <Label7 />
      <MediaUpload />
    </div>
  );
}

function Form4() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="Form">
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 isolate items-center justify-start p-[24px] relative w-full">
          <div className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#171a26] text-[18px] tracking-[0.09px] w-full z-[2]">
            <p className="leading-[28px]">Image</p>
          </div>
          <WithLabelMediaUpload />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Label8() {
  return (
    <div className="bg-[#f0f0f0] box-border content-stretch flex flex-col gap-2 items-center justify-center px-3 py-1.5 relative rounded-[100px] shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#d1d0d2] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#87868a] text-[14px] text-nowrap tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Draft</p>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex gap-3 items-center justify-start relative shrink-0 w-full z-[2]" data-name="Title">
      <div className="basis-0 font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#171a26] text-[18px] tracking-[0.09px]">
        <p className="leading-[28px]">Status</p>
      </div>
      <Label8 />
    </div>
  );
}

function Label9() {
  return (
    <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0 w-full" data-name="Label">
      <div className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#4b4a4d] text-[14px] tracking-[0.07px]">
        <p className="leading-[20px]">Project Status</p>
      </div>
    </div>
  );
}

function TypingArea6() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px overflow-clip relative shrink-0" data-name="Typing Area">
      <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#171a26] text-[14px] text-nowrap tracking-[0.07px]">
        <p className="leading-[20px] whitespace-pre">Draft</p>
      </div>
    </div>
  );
}

function AltArrowDown2() {
  return (
    <div className="relative shrink-0 size-5" data-name="Alt Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Alt Arrow Down">
          <path d={svgPaths.p22504d80} id="Vector" stroke="var(--stroke-0, #69686D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Icon1() {
  return (
    <div className="box-border content-stretch flex gap-2 items-center justify-center p-[8px] relative shrink-0 size-5" data-name="Icon">
      <AltArrowDown2 />
    </div>
  );
}

function MediumSelectOption1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Medium Select Option">
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex gap-1.5 items-center justify-center px-4 py-3 relative w-full">
          <TypingArea6 />
          <Icon1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function WithLabelSelectOption1() {
  return (
    <div className="content-stretch flex flex-col gap-1.5 items-start justify-start relative shrink-0 w-full z-[1]" data-name="With Label_Select Option">
      <Label9 />
      <MediumSelectOption1 />
    </div>
  );
}

function Form5() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="Form">
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 isolate items-center justify-start p-[24px] relative w-full">
          <Title />
          <WithLabelSelectOption1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e9] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function RightCol() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-[280px]" data-name="Right Col">
      <Form4 />
      <Form5 />
    </div>
  );
}

function Form6() {
  return (
    <div className="content-stretch flex gap-4 items-start justify-start relative shrink-0 w-full" data-name="Form">
      <LeftCol />
      <RightCol />
    </div>
  );
}

export default function Body2() {
  return (
    <div className="relative size-full" data-name="Body">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start px-8 py-6 relative size-full">
          <PageTitle />
          <Form6 />
        </div>
      </div>
    </div>
  );
}