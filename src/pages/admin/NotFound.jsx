import { BackButton } from "../../components/navigation";
import { CoffeeBeanIcon } from "../../components/media";
import { Heading, Paragraph } from "../../components/typography";
import { PulseGlow, FadeIn } from "../../components/animation";

export default function NotFound() {
  return (
    <FadeIn duration={0.5}>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-8">
          <PulseGlow>
            <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center">
              <CoffeeBeanIcon size="lg" color="#D97706" />
            </div>
          </PulseGlow>
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 font-bold text-lg">?</span>
          </div>
        </div>

        <Heading level={1} className="!text-7xl mb-3">404</Heading>
        <Heading level={2} className="!text-xl !font-semibold !text-gray-600 mb-2">
          Page Not Found
        </Heading>
        <Paragraph className="text-center max-w-sm mb-8">
          Oops! The page you're looking for seems to have spilled. Let's get you
          back to the coffee shop.
        </Paragraph>

        <BackButton to="/" label="Back to Dashboard" />
      </div>
    </FadeIn>
  );
}
