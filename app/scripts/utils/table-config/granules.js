'use strict';
import path from 'path';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router';
import {
  fromNow,
  seconds,
  bool,
  nullValue,
  displayCase,
  collectionLink,
  granuleLink
} from '../format';
import {
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import ErrorReport from '../../components/errors/report';
import Dropdown from '../../components/form/simple-dropdown';

export const tableHeader = [
  'Status',
  'Name',
  'Published',
  'Collection ID',
  'Execution',
  'Duration',
  'Updated'
];

export const tableRow = [
  (d) => <Link to={`/granules/${d.status}`} className={`granule__status granule__status--${d.status}`}>{displayCase(d.status)}</Link>,
  (d) => granuleLink(d.granuleId),
  (d) => d.cmrLink ? <a href={d.cmrLink} target='_blank'>{bool(d.published)}</a> : bool(d.published),
  (d) => collectionLink(d.collectionId),
  (d) => <Link to={`/executions/execution/${path.basename(d.execution)}`}>link</Link>,
  (d) => seconds(d.duration),
  (d) => fromNow(d.timestamp)
];

export const tableSortProps = [
  'status',
  'granuleId',
  'published',
  'collectionId',
  null,
  'duration',
  'timestamp'
];

export const errorTableHeader = [
  'Error',
  'Type',
  'Granule',
  'Duration',
  'Updated'
];

export const errorTableRow = [
  (d) => <ErrorReport report={get(d, 'error.Cause', nullValue)} truncate={true} />,
  (d) => get(d, 'error.Error', nullValue),
  (d) => granuleLink(d.granuleId),
  (d) => seconds(d.duration),
  (d) => fromNow(d.timestamp)
];

export const errorTableSortProps = [
  null,
  null,
  'granuleId',
  'duration',
  'timestamp'
];

export const simpleDropdownOption = function (config) {
  return (
    <Dropdown
      key={config.label}
      label={config.label.toUpperCase()}
      value={config.value}
      options={config.options}
      id={config.label}
      onChange={config.handler}
      noNull={true}
    />
  );
};

const confirmReingest = (d) => `Reingest ${d} granules(s)? Note, completed granules cannot be reingested.`;
const confirmApply = (d) => `Run workflow on ${d} granules?`;
const confirmRemove = (d) => `Remove ${d} granule(s) from CMR?`;
const confirmDelete = (d) => `Delete ${d} granule(s)?`;
export const bulkActions = function (granules, config) {
  return [{
    text: 'Reingest',
    action: reingestGranule,
    state: granules.reingested,
    confirm: confirmReingest
  }, {
    text: 'Execute',
    action: config.execute.action,
    state: granules.executed,
    confirm: confirmApply,
    confirmOptions: config.execute.options
  }, {
    text: 'Remove from CMR',
    action: removeGranule,
    state: granules.removed,
    confirm: confirmRemove
  }, {
    text: 'Delete',
    action: deleteGranule,
    state: granules.deleted,
    confirm: confirmDelete
  }];
};
