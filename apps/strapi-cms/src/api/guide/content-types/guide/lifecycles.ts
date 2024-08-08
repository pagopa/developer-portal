import { errors } from '@strapi/utils';

interface IGuide {
  readonly versions?: Array<{
    id: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __pivot: { field: string; component_type: string };
  }>;
}

interface IGuideEvent {
  readonly params: {
    readonly data: IGuide;
    readonly where?: {
      readonly id?: string;
    };
  };
}

const validateGuideVersions = async (event: IGuideEvent) => {
  const { data } = event.params;

  if (data.versions && Array.isArray(data.versions)) {
    const versionIds = data.versions.map((v) => v.id);

    // Fetch the full version data
    const versions = await strapi.db.connection
      .select('*')
      .from(`components_common_guide_versions`)
      .whereIn('id', versionIds);

    const mainVersions = versions.filter((version) => version.main === 1);

    if (mainVersions.length > 1) {
      throw new errors.ApplicationError(
        'Only one version can have main set to true'
      );
    }
  }

  return true;
};

const validateListItems = async (event: IGuideEvent) => {
  const { data } = event.params;
  if ('listItems' in data && (data.listItems as unknown[]).length > 4) {
    throw new errors.ApplicationError(
      'List items must be less than 4 elements long'
    );
  }

  return true;
};

module.exports = {
  async beforeCreate(event: IGuideEvent) {
    await validateGuideVersions(event);
    await validateListItems(event);
  },
  async beforeUpdate(event: IGuideEvent) {
    await validateGuideVersions(event);
    await validateListItems(event);
  },
};
