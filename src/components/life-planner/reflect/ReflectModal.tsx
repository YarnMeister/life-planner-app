'use client';

import { useState, useMemo } from 'react';
import {
  Modal,
  Stack,
  Text,
  Button,
  Stepper,
  Group,
  Card,
  Slider,
  Textarea,
  Badge,
  Title,
  Progress,
} from '@mantine/core';
import { IconMoodSmile, IconMoodHappy, IconMoodSad, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { useLifeOS } from '@/hooks/useLifeOS';
import { Theme } from '@/types';

interface ReflectModalProps {
  opened: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface ThemeRating {
  themeId: string;
  rating: number;
  note?: string;
}

export function ReflectModal({ opened, onClose, onComplete }: ReflectModalProps) {
  const { pillars, themes, updateTheme } = useLifeOS();
  const [activeStep, setActiveStep] = useState(0);
  const [mood, setMood] = useState<'good' | 'neutral' | 'bad' | null>(null);
  const [themeRatings, setThemeRatings] = useState<Map<string, ThemeRating>>(new Map());
  const [overallNote, setOverallNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Calculate statistics
  const statistics = useMemo(() => {
    let improved = 0;
    let declined = 0;
    let unchanged = 0;
    const improvedThemes: Array<{ theme: Theme; change: number }> = [];
    const declinedThemes: Array<{ theme: Theme; change: number }> = [];

    themes.forEach((theme) => {
      const rating = themeRatings.get(theme.id);
      if (!rating) return;

      const previousRating = theme.previousRating ?? theme.rating;
      const change = rating.rating - previousRating;

      if (change > 0) {
        improved++;
        improvedThemes.push({ theme, change });
      } else if (change < 0) {
        declined++;
        declinedThemes.push({ theme, change });
      } else {
        unchanged++;
      }
    });

    // Sort by absolute change
    improvedThemes.sort((a, b) => b.change - a.change);
    declinedThemes.sort((a, b) => a.change - b.change);

    return { improved, declined, unchanged, improvedThemes, declinedThemes };
  }, [themes, themeRatings]);

  const handleThemeRatingChange = (themeId: string, rating: number, note?: string) => {
    setThemeRatings((prev) => {
      const next = new Map(prev);
      next.set(themeId, { themeId, rating, note });
      return next;
    });
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      // Save all theme ratings sequentially to avoid version conflicts
      // (each update increments the version, so parallel updates would conflict)
      for (const rating of themeRatings.values()) {
        const theme = themes.find((t) => t.id === rating.themeId);
        await updateTheme(rating.themeId, {
          rating: rating.rating,
          previousRating: theme?.rating,
          lastReflectionNote: rating.note,
        });
      }

      // Save timestamp to localStorage
      const reflectionData = {
        timestamp: new Date().toISOString(),
        themesRated: themeRatings.size,
        improved: statistics.improved,
        declined: statistics.declined,
        mood,
      };
      localStorage.setItem('lifeOS:lastReflection', JSON.stringify(reflectionData));

      onComplete();
      handleClose();
    } catch (error) {
      console.error('Failed to save reflection:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setMood(null);
    setThemeRatings(new Map());
    setOverallNote('');
    onClose();
  };

  const nextStep = () => setActiveStep((current) => Math.min(current + 1, 2));
  const prevStep = () => setActiveStep((current) => Math.max(current - 1, 0));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Reflection Session"
      size="xl"
      closeOnClickOutside={false}
    >
      <Stack gap="lg">
        <Stepper active={activeStep} onStepClick={setActiveStep}>
          <Stepper.Step label="Welcome" description="How are you feeling?">
            <Stack gap="md" mt="md">
              <Title order={3}>Welcome to your reflection session</Title>
              <Text>
                Take a moment to reflect on your life areas. Rate each core area based on how you feel about it right now.
              </Text>

              <div>
                <Text fw={500} mb="sm">How are you feeling today?</Text>
                <Group>
                  <Button
                    variant={mood === 'good' ? 'filled' : 'light'}
                    leftSection={<IconMoodHappy size={20} />}
                    onClick={() => setMood('good')}
                    color="green"
                  >
                    Good
                  </Button>
                  <Button
                    variant={mood === 'neutral' ? 'filled' : 'light'}
                    leftSection={<IconMoodSmile size={20} />}
                    onClick={() => setMood('neutral')}
                    color="blue"
                  >
                    Neutral
                  </Button>
                  <Button
                    variant={mood === 'bad' ? 'filled' : 'light'}
                    leftSection={<IconMoodSad size={20} />}
                    onClick={() => setMood('bad')}
                    color="orange"
                  >
                    Could be better
                  </Button>
                </Group>
              </div>

              <Group justify="flex-end" mt="xl">
                <Button onClick={nextStep}>Start Reflection</Button>
              </Group>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Rate" description="Rate your core areas">
            <Stack gap="md" mt="md">
              <div>
                <Text fw={500}>Rate your core areas</Text>
                <Text size="sm" c="dimmed">
                  {themeRatings.size} of {themes.length} rated
                </Text>
                <Progress value={(themeRatings.size / themes.length) * 100} mt="xs" />
              </div>

              <Stack gap="md" style={{ maxHeight: '400px', overflow: 'auto' }}>
                {pillars.map((pillar) => {
                  const pillarThemes = themes.filter((t) => t.pillarId === pillar.id);
                  if (pillarThemes.length === 0) return null;

                  return (
                    <div key={pillar.id}>
                      <Text fw={600} c={pillar.color} mb="xs">
                        {pillar.name}
                      </Text>
                      <Stack gap="sm">
                        {pillarThemes.map((theme) => {
                          const rating = themeRatings.get(theme.id);
                          return (
                            <Card key={theme.id} padding="sm" withBorder>
                              <Stack gap="xs">
                                <Text size="sm" fw={500}>{theme.name}</Text>
                                <Slider
                                  value={rating?.rating ?? theme.rating}
                                  onChange={(value) => handleThemeRatingChange(theme.id, value, rating?.note)}
                                  min={0}
                                  max={100}
                                  step={5}
                                  marks={[
                                    { value: 0, label: '0%' },
                                    { value: 50, label: '50%' },
                                    { value: 100, label: '100%' },
                                  ]}
                                  color={pillar.color}
                                  label={(value) => `${value}%`}
                                />
                                <Textarea
                                  placeholder="Optional note..."
                                  value={rating?.note ?? ''}
                                  onChange={(e) => handleThemeRatingChange(theme.id, rating?.rating ?? theme.rating, e.target.value)}
                                  size="xs"
                                  autosize
                                  minRows={1}
                                  maxRows={3}
                                />
                              </Stack>
                            </Card>
                          );
                        })}
                      </Stack>
                    </div>
                  );
                })}
              </Stack>

              <Group justify="space-between" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue to Summary</Button>
              </Group>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Summary" description="Review your reflection">
            <Stack gap="md" mt="md">
              <Title order={3}>Reflection Summary</Title>

              <Group grow>
                <Card padding="md" withBorder>
                  <Stack gap="xs" align="center">
                    <IconTrendingUp size={32} color="green" />
                    <Text size="xl" fw={700}>{statistics.improved}</Text>
                    <Text size="sm" c="dimmed">Improved</Text>
                  </Stack>
                </Card>
                <Card padding="md" withBorder>
                  <Stack gap="xs" align="center">
                    <IconTrendingDown size={32} color="red" />
                    <Text size="xl" fw={700}>{statistics.declined}</Text>
                    <Text size="sm" c="dimmed">Declined</Text>
                  </Stack>
                </Card>
                <Card padding="md" withBorder>
                  <Stack gap="xs" align="center">
                    <Text size="xl" fw={700}>{statistics.unchanged}</Text>
                    <Text size="sm" c="dimmed">Unchanged</Text>
                  </Stack>
                </Card>
              </Group>

              {statistics.improvedThemes.length > 0 && (
                <div>
                  <Text fw={500} mb="xs">Top Improvements</Text>
                  <Stack gap="xs">
                    {statistics.improvedThemes.slice(0, 3).map(({ theme, change }) => (
                      <Group key={theme.id} justify="space-between">
                        <Text size="sm">{theme.name}</Text>
                        <Badge color="green">+{change}%</Badge>
                      </Group>
                    ))}
                  </Stack>
                </div>
              )}

              {statistics.declinedThemes.length > 0 && (
                <div>
                  <Text fw={500} mb="xs">Areas Needing Attention</Text>
                  <Stack gap="xs">
                    {statistics.declinedThemes.slice(0, 3).map(({ theme, change }) => (
                      <Group key={theme.id} justify="space-between">
                        <Text size="sm">{theme.name}</Text>
                        <Badge color="red">{change}%</Badge>
                      </Group>
                    ))}
                  </Stack>
                </div>
              )}

              <Textarea
                label="Overall Reflection (Optional)"
                placeholder="Any thoughts about this reflection session?"
                value={overallNote}
                onChange={(e) => setOverallNote(e.target.value)}
                autosize
                minRows={3}
                maxRows={6}
              />

              <Group justify="space-between" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={handleComplete} loading={isSaving}>
                  Complete Reflection
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>
        </Stepper>
      </Stack>
    </Modal>
  );
}

