import { gql } from '@apollo/client';

/*
  The queries below are used between several components.
  They are extracted here to prevent circular references.
*/

export const KANBAN_JOB_FRAGMENT = gql`
  fragment KanbanCardJob on Job {
    id
    customer {
      id
      name
    }
    staffPrimary {
      id
      username
    }
    staffSecondary {
      id
      username
    }
  }
`;

export const KANBAN_FIND_TODO_JOBS = gql`
  query JobKanbanFindTodoJobs {
    jobs(
      first: 30,
      where: {
        checkIn: {
          equals: null
        },
        checkOut: {
          equals: null
        },
        state: {
          equals: TODO
        }
      }
    ) {
      ...KanbanCardJob
    }
  }
  ${KANBAN_JOB_FRAGMENT}
`;

export const KANBAN_FIND_IN_PROGRESS_JOBS = gql`
  query JobKanbanFindInProgressJobs {
    jobs(
      first: 30,
      where: {
        checkIn: {
          not: null
        },
        checkOut: {
          equals: null
        },
        state: {
          equals: TODO
        }
      }
    ) {
      ...KanbanCardJob
    }
  }
  ${KANBAN_JOB_FRAGMENT}
`;

export const KANBAN_FIND_DONE_JOBS = gql`
  query JobKanbanFindDoneJobs {
    jobs(
      first: 30,
      where: {
        checkIn: {
          not: null
        },
        checkOut: {
          not: null
        },
        OR: [
          {
            state: {
              equals: DONE
            }
          },
          {
            state: {
              equals: FOLLOW_UP
            }
          }
        ]
      }
    ) {
      ...KanbanCardJob
    }
  }
  ${KANBAN_JOB_FRAGMENT}
`;
