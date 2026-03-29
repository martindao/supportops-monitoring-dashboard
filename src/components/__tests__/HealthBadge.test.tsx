import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HealthBadge } from '../HealthBadge';

describe('HealthBadge', () => {
  it('renders "Healthy" with green styling', () => {
    const { container } = render(<HealthBadge health="healthy" />);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('text-emerald-500');
  });

  it('renders "Degraded" with amber styling', () => {
    const { container } = render(<HealthBadge health="degraded" />);
    expect(screen.getByText('Degraded')).toBeInTheDocument();
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('text-amber-500');
  });

  it('renders "Down" with red styling', () => {
    const { container } = render(<HealthBadge health="down" />);
    expect(screen.getByText('Down')).toBeInTheDocument();
    const badge = container.querySelector('span');
    expect(badge?.className).toContain('text-rose-500');
  });

  it('includes a colored status dot', () => {
    const { container } = render(<HealthBadge health="healthy" />);
    const dot = container.querySelector('.rounded-full');
    expect(dot).toBeInTheDocument();
    expect(dot?.className).toContain('bg-emerald-500');
  });
});
