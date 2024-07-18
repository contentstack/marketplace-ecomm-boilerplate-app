/* eslint-disable @typescript-eslint/no-unused-vars */
import { Select } from '@contentstack/venus-components';
import React, { useEffect, useState } from 'react'

function FilterComponent({
    config,
    meta,
    updateList
}: any) {
  const options = [
    {
      label: 'Option 1',
      value: 'option1'
    },
    {
      label: 'Option 2',
      value: 'option2'
    },
    {
      label: 'Option 3',
      value: 'option3'
    }
  ]
  const [value, setValue] = useState(null);
  const handleValueUpdate = (data:any) => {
    setValue(data)
  }
  useEffect(()=> {
    console.info('config', config)
    console.info('meta', meta)
  }, [config, meta])

  useEffect(() => {
    updateList(value);
  }, [value])
  return (
    <div>
        <Select
            selectLabel="Select a filter"
            options={options}
            value={value}
            onChange={handleValueUpdate}
            placeholder="Select a filter"
            version='v2'

        />
    </div>
  )
}

export default FilterComponent