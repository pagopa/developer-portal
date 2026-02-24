import { makeContactPayload } from '../../helpers/makeContactPayload';
import { customFieldIds } from '../../config';
import { User } from '../../types/user';

describe('makeContactPayload', () => {
  const baseUser: User = {
    username: '466e0280-9061-7007-c3e0-beb6be672f68',
    email: 'test@example.com',
    given_name: 'Giovanni',
    family_name: 'Doe',
    'custom:mailinglist_accepted': 'true',
    'custom:survey_accepted': 'false',
    'custom:company_type': 'Test Co',
    'custom:job_role': 'Developer',
    'custom:preferred_language': 'en',
  };

  it('should correctly transform a complete user object into contact payload', () => {
    const result = makeContactPayload(baseUser);

    expect(result).toEqual({
      contact: {
        email: 'test@example.com',
        firstName: 'Giovanni',
        lastName: 'Doe',
        phone: 'cognito:466e0280-9061-7007-c3e0-beb6be672f68',
        fieldValues: [
          {
            field: customFieldIds.companyType,
            value: 'Test Co',
          },
          {
            field: customFieldIds.jobRole,
            value: 'Developer',
          },
          {
            field: customFieldIds.mailingListAccepted,
            value: 'TRUE',
          },
          {
            field: customFieldIds.surveyAccepted,
            value: 'FALSE',
          },
          {
            field: customFieldIds.preferredLanguage,
            value: 'en',
          },
        ],
      },
    });
  });

  it('should default preferredLanguage to "it" when custom:preferred_language is missing', () => {
    const userWithoutLanguage: User = {
      ...baseUser,
      'custom:preferred_language': undefined,
    };

    const result = makeContactPayload(userWithoutLanguage);

    const languageField = result.contact.fieldValues.find(
      (field) => field.field === customFieldIds.preferredLanguage
    );
    expect(languageField?.value).toBe('it');
  });

  it('should use provided preferredLanguage when custom:preferred_language is present', () => {
    const userWithSpanish: User = {
      ...baseUser,
      'custom:preferred_language': 'es',
    };

    const result = makeContactPayload(userWithSpanish);

    const languageField = result.contact.fieldValues.find(
      (field) => field.field === customFieldIds.preferredLanguage
    );
    expect(languageField?.value).toBe('es');
  });

  it('should convert mailinglist_accepted "true" to "TRUE"', () => {
    const result = makeContactPayload(baseUser);

    const mailingListField = result.contact.fieldValues.find(
      (field) => field.field === customFieldIds.mailingListAccepted
    );
    expect(mailingListField?.value).toBe('TRUE');
  });

  it('should convert mailinglist_accepted "false" to "FALSE"', () => {
    const userWithFalseMailingList: User = {
      ...baseUser,
      'custom:mailinglist_accepted': 'false',
    };

    const result = makeContactPayload(userWithFalseMailingList);

    const mailingListField = result.contact.fieldValues.find(
      (field) => field.field === customFieldIds.mailingListAccepted
    );
    expect(mailingListField?.value).toBe('FALSE');
  });

  it('should convert survey_accepted "true" to "TRUE"', () => {
    const userWithTrueSurvey: User = {
      ...baseUser,
      'custom:survey_accepted': 'true',
    };

    const result = makeContactPayload(userWithTrueSurvey);

    const surveyField = result.contact.fieldValues.find(
      (field) => field.field === customFieldIds.surveyAccepted
    );
    expect(surveyField?.value).toBe('TRUE');
  });

  it('should convert survey_accepted "false" to "FALSE"', () => {
    const result = makeContactPayload(baseUser);

    const surveyField = result.contact.fieldValues.find(
      (field) => field.field === customFieldIds.surveyAccepted
    );
    expect(surveyField?.value).toBe('FALSE');
  });

  it('should format phone as "cognito:{username}"', () => {
    const result = makeContactPayload(baseUser);

    expect(result.contact.phone).toBe(
      'cognito:466e0280-9061-7007-c3e0-beb6be672f68'
    );
  });

  it('should include all required fieldValues', () => {
    const result = makeContactPayload(baseUser);

    expect(result.contact.fieldValues).toHaveLength(5);

    const fieldIds = result.contact.fieldValues.map((field) => field.field);
    expect(fieldIds).toContain(customFieldIds.companyType);
    expect(fieldIds).toContain(customFieldIds.jobRole);
    expect(fieldIds).toContain(customFieldIds.mailingListAccepted);
    expect(fieldIds).toContain(customFieldIds.surveyAccepted);
    expect(fieldIds).toContain(customFieldIds.preferredLanguage);
  });
});
