import { describe, it, expect } from 'vitest';
import { render } from '../utils/test-utils';
import Materials from '../../pages/Materials';
import Tiles from '../../pages/Tiles';
import Pricing from '../../pages/Pricing';
import Logistics from '../../pages/Logistics';
import Accommodation from '../../pages/Accommodation';
import Files from '../../pages/Files';
import Concepts from '../../pages/Concepts';
import Documents from '../../pages/Documents';
import Messaging from '../../pages/Messaging';
import { checkA11y } from '../utils/test-utils';

describe('Accessibility Tests', () => {
  it('Materials page is accessible', async () => {
    const { container } = render(<Materials />);
    await checkA11y(container);
  });

  it('Tiles page is accessible', async () => {
    const { container } = render(<Tiles />);
    await checkA11y(container);
  });

  it('Pricing page is accessible', async () => {
    const { container } = render(<Pricing />);
    await checkA11y(container);
  });

  it('Logistics page is accessible', async () => {
    const { container } = render(<Logistics />);
    await checkA11y(container);
  });

  it('Accommodation page is accessible', async () => {
    const { container } = render(<Accommodation />);
    await checkA11y(container);
  });

  it('Files page is accessible', async () => {
    const { container } = render(<Files />);
    await checkA11y(container);
  });

  it('Concepts page is accessible', async () => {
    const { container } = render(<Concepts />);
    await checkA11y(container);
  });

  it('Documents page is accessible', async () => {
    const { container } = render(<Documents />);
    await checkA11y(container);
  });

  it('Messaging page is accessible', async () => {
    const { container } = render(<Messaging />);
    await checkA11y(container);
  });
});
