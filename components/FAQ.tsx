import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';
import { Faq } from '@/lib/types';

const FAQ = ({ faqs }: { faqs: Faq[] }) => {
  return (
    <Accordion
      type='multiple'
      collapsible
      defaultValue={['item-1']}
      className='w-full bg-card rounded-twice'
    >
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`} className={index === 0 ? "border-t-0" : ""}>
          <AccordionTrigger>
            <Text className="text-lg font-medium">{faq.question}</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-muted-foreground">{faq.answer}</Text>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default FAQ;
