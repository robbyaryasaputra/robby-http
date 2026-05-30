import { BackButton } from "../components/7-navigation";
import { Heading, Paragraph } from "../components/14-typography";
import { FadeIn } from "../components/15-animation";

export default function ErrorPage({ errorCode = "500", errorDescription = "Something went wrong.", errorImage }) {
  return (
    <FadeIn duration={0.5}>
      <div className="flex flex-col items-center justify-center py-20">
        {errorImage && (
          <img src={errorImage} alt={`Error ${errorCode}`} className="w-64 h-auto rounded-2xl shadow-lg mb-8" />
        )}
        <Heading level={1} className="!text-6xl mb-2">{errorCode}</Heading>
        <Paragraph className="text-center max-w-md mb-8">{errorDescription}</Paragraph>
        
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>
    </FadeIn>
  );
}
