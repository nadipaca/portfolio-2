import { memo } from 'react';
import { motion } from 'framer-motion';
import CaseStudyCard from './CaseStudyCard';
import { caseStudies } from '../data/caseStudies';
import SectionWrapper from './ui/SectionWrapper';
import SectionHeader from './ui/SectionHeader';
import Button from './ui/Button';

function Projects() {
  // Memoize filtered case studies to prevent re-filtering on re-renders
  const featuredCaseStudies = caseStudies.filter(
    cs => ['playground-app', 'healthcare-agent', 'novamart'].includes(cs.id)
  );

  return (
    <SectionWrapper id="projects">
      <SectionHeader
        title="Case Studies"
        subtitle="Architecture, decisions, and measurable outcomes."
      >
        <Button
          as="a"
          href="#all-projects"
          variant="primary"
          size="md"
          className="rounded-full shadow-sm"
        >
          See all projects
        </Button>
      </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-12 md:gap-6">
          {featuredCaseStudies.map((caseStudy, index) => (
            <motion.div
              key={caseStudy.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CaseStudyCard caseStudy={caseStudy} />
            </motion.div>
          ))}
        </div>
    </SectionWrapper>
  );
}

export default memo(Projects);
