/**
 * Test Fixtures
 * 
 * This module provides helper functions to get predictable test data
 * from the existing mock data. Use these in tests instead of hardcoding
 * IDs or data structures.
 * 
 * @example
 * ```tsx
 * import { getTestContact } from '@/tests/fixtures';
 * 
 * test('renders contact name', () => {
 *   const contact = getTestContact();
 *   render(<ContactCard contact={contact} />);
 *   expect(screen.getByText(contact.name)).toBeInTheDocument();
 * });
 * ```
 */

import { mockGroups, searchAll } from '@/lib/mockData';
import { getAllProducts, productCategories } from '@/lib/pipedriveData';
import type { 
  MineGroup, 
  MineName, 
  Contact, 
  Deal, 
  Order, 
  Note,
  Activity 
} from '@/lib/mockData';
import type { Product } from '@/lib/pipedriveData';

/**
 * Predefined test IDs for consistent testing
 * These IDs match actual data in mockData.ts
 */
export const TEST_IDS = {
  // SA Mining Corp (g1)
  group: 'g1',
  site: 's1',
  contact: 'c1',
  contact2: 'c2',
  deal: 'd1',
  order: 'o1',
  
  // Zimbabwe Gold Consortium (g2)
  group2: 'g2',
  site2: 's4',
  contact3: 'c7',
  
  // Botswana Diamond Operations (g3)
  group3: 'g3',
  site3: 's6',
} as const;

/**
 * Returns the primary test group (SA Mining Corp)
 * This is the most feature-rich group with multiple sites and contacts
 */
export function getTestGroup(): MineGroup {
  const group = mockGroups.find((g) => g.id === TEST_IDS.group);
  if (!group) {
    throw new Error(`Test group with id ${TEST_IDS.group} not found in mockData`);
  }
  return group;
}

/**
 * Returns a secondary test group (Zimbabwe Gold Consortium)
 * Useful for testing multiple groups or comparisons
 */
export function getTestGroup2(): MineGroup {
  const group = mockGroups.find((g) => g.id === TEST_IDS.group2);
  if (!group) {
    throw new Error(`Test group with id ${TEST_IDS.group2} not found in mockData`);
  }
  return group;
}

/**
 * Returns the primary test site (Johannesburg Main Site)
 * This site has multiple contacts, deals, and orders
 */
export function getTestSite(): MineName {
  const group = getTestGroup();
  const site = group.sites.find((s) => s.id === TEST_IDS.site);
  if (!site) {
    throw new Error(`Test site with id ${TEST_IDS.site} not found in group ${TEST_IDS.group}`);
  }
  return site;
}

/**
 * Returns a secondary test site (Harare Central)
 * From a different group for cross-group testing
 */
export function getTestSite2(): MineName {
  const group = getTestGroup2();
  const site = group.sites.find((s) => s.id === TEST_IDS.site2);
  if (!site) {
    throw new Error(`Test site with id ${TEST_IDS.site2} not found in group ${TEST_IDS.group2}`);
  }
  return site;
}

/**
 * Returns the primary test contact (Thabo Mbeki)
 * This contact has deals and notes attached
 */
export function getTestContact(): Contact {
  const site = getTestSite();
  const contact = site.contacts.find((c) => c.id === TEST_IDS.contact);
  if (!contact) {
    throw new Error(`Test contact with id ${TEST_IDS.contact} not found in site ${TEST_IDS.site}`);
  }
  return contact;
}

/**
 * Returns a secondary test contact (Sarah Nkosi)
 * From the same site as the primary contact
 */
export function getTestContact2(): Contact {
  const site = getTestSite();
  const contact = site.contacts.find((c) => c.id === TEST_IDS.contact2);
  if (!contact) {
    throw new Error(`Test contact with id ${TEST_IDS.contact2} not found in site ${TEST_IDS.site}`);
  }
  return contact;
}

/**
 * Returns a test contact from a different group (Grace Mugabe)
 * Useful for testing cross-group scenarios
 */
export function getTestContact3(): Contact {
  const site = getTestSite2();
  const contact = site.contacts.find((c) => c.id === TEST_IDS.contact3);
  if (!contact) {
    throw new Error(`Test contact with id ${TEST_IDS.contact3} not found in site ${TEST_IDS.site2}`);
  }
  return contact;
}

/**
 * Returns the primary test deal (Heavy Machinery Parts - Q4)
 * This is a high urgency deal in Procurement stage
 */
export function getTestDeal(): Deal {
  const contact = getTestContact();
  const deal = contact.deals.find((d) => d.id === TEST_IDS.deal);
  if (!deal) {
    throw new Error(`Test deal with id ${TEST_IDS.deal} not found for contact ${TEST_IDS.contact}`);
  }
  return deal;
}

/**
 * Returns all deals from the test group
 * Useful for testing lists and filtering
 */
export function getAllTestDeals(): Deal[] {
  const group = getTestGroup();
  return group.sites.flatMap((s) => s.deals);
}

/**
 * Returns the primary test order (Drill Bits - Premium Grade)
 * This order is in Manufacturing stage
 */
export function getTestOrder(): Order {
  const site = getTestSite();
  const order = site.orders.find((o) => o.id === TEST_IDS.order);
  if (!order) {
    throw new Error(`Test order with id ${TEST_IDS.order} not found in site ${TEST_IDS.site}`);
  }
  return order;
}

/**
 * Returns all orders from the test group
 * Useful for testing order lists and filtering
 */
export function getAllTestOrders(): Order[] {
  const group = getTestGroup();
  return group.sites.flatMap((s) => s.orders);
}

/**
 * Returns test notes from the primary contact
 * Array includes voice, text, and check-in note types
 */
export function getTestNotes(): Note[] {
  const contact = getTestContact();
  return contact.notes;
}

/**
 * Returns test activities from the primary group
 * Includes visits, deals, and notes activities
 */
export function getTestActivities(): Activity[] {
  const group = getTestGroup();
  return group.recentActivity;
}

/**
 * Returns a test product from the Cable category
 * Predictable product for quote/request testing
 */
export function getTestProduct(): Product {
  const products = productCategories['Cable'];
  if (!products || products.length === 0) {
    throw new Error('Cable products not found in productCategories');
  }
  return products[0]; // Greenline 3Pair BCSW 500m
}

/**
 * Returns a test product from Environmental Monitoring category
 * Different category for testing product variety
 */
export function getTestProduct2(): Product {
  const products = productCategories['Environmental Monitoring'];
  if (!products || products.length === 0) {
    throw new Error('Environmental Monitoring products not found in productCategories');
  }
  return products[0]; // Air Quality Sensor
}

/**
 * Returns all available products
 * Useful for testing product catalogs and search
 */
export function getAllTestProducts(): Product[] {
  return getAllProducts();
}

/**
 * Returns all product categories with their products
 * Useful for testing category-based UI
 */
export function getTestProductCategories(): Record<string, Product[]> {
  return productCategories;
}

/**
 * Helper to test search functionality
 * Returns search results for a given query
 */
export function getTestSearchResults(query: string) {
  return searchAll(query);
}

/**
 * Returns all test groups
 * Useful for testing group lists
 */
export function getAllTestGroups(): MineGroup[] {
  return mockGroups;
}

