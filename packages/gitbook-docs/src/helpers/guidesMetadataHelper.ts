export interface StrapiGuide {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly title: string;
    readonly product?: {
      readonly data?: {
        readonly attributes?: {
          readonly slug: string;
        };
      };
    };
    readonly versions: readonly {
      readonly id: number;
      readonly main: boolean;
      readonly version: string;
      readonly dirName: string;
    }[];
  };
}

export interface StrapiReleaseNote {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly title: string;
    readonly product?: {
      readonly data?: {
        readonly attributes?: {
          readonly slug: string;
        };
      };
    };
    readonly dirName: string;
    readonly landingFile: string;
  };
}

export interface StrapiSolution {
  readonly id: number;
  readonly attributes: {
    readonly slug: string;
    readonly title: string;
    readonly landingUseCaseFile: string;
    readonly dirName: string;
  };
}

export interface StrapiProduct {
  readonly attributes: {
    readonly name: string;
    readonly shortName: string;
    readonly slug: string;
  };
}

export interface StrapiApiData {
  readonly id: number;
  readonly attributes: {
    readonly title: string;
    readonly description?: string;
    readonly icon: {
      readonly data?: {
        readonly attributes: {
          readonly name: string;
          readonly ext: string;
          readonly mime: string;
          readonly size: number;
          readonly url: string;
          readonly alternativeText?: string;
          readonly caption?: string;
          readonly height?: number;
          readonly width?: number;
        };
      };
    };
    readonly apiRestDetail?: {
      readonly slug: string;
      readonly specUrls: readonly {
        readonly id: number;
        readonly name?: string;
        readonly url: string;
        readonly hideTryIt: boolean;
      }[];
    };
    readonly apiSoapDetail?: {
      readonly slug: string;
      readonly repositoryUrl: string;
      readonly dirName: string;
    };
  };
}

export enum MetadataType {
  Guide = 0,
  ReleaseNote = 1,
  Solution = 2,
}

export type MetadataInfo = {
  readonly versionName: string;
  readonly isMainVersion: boolean;
  readonly dirName: string;
  readonly slug: string;
  readonly productSlug: string;
  readonly metadataType?: MetadataType;
};

// This model must be synchronized with the Strapi API responses for guide list pages and solution list page
export interface StrapiGuideListPageResponse {
  readonly data: readonly {
    readonly id: number;
    readonly attributes: {
      readonly product?: {
        readonly data?: {
          readonly id: number;
          readonly attributes: {
            readonly logo?: {
              readonly data?: {
                readonly id: number;
                readonly attributes: {
                  readonly url: string;
                  readonly name: string;
                  readonly alternativeText?: string;
                };
              };
            };
            readonly bannerLinks?: readonly {
              readonly id: number;
              readonly text: string;
              readonly href: string;
              readonly icon?: {
                readonly data?: {
                  readonly id: number;
                  readonly attributes: {
                    readonly url: string;
                    readonly name: string;
                    readonly alternativeText?: string;
                  };
                };
              };
            }[];
            readonly overview?: string;
            readonly quickstart_guide?: {
              readonly data?: {
                readonly id: number;
                readonly attributes: {
                  readonly slug: string;
                  readonly title: string;
                };
              };
            };
            readonly release_note?: {
              readonly data?: {
                readonly id: number;
                readonly attributes: {
                  readonly slug: string;
                  readonly title: string;
                };
              };
            };
            readonly api_data_list_page?: {
              readonly data?: {
                readonly id: number;
                readonly attributes: {
                  readonly apiData?: {
                    readonly data?: readonly {
                      readonly id: number;
                      readonly attributes: {
                        readonly title: string;
                        readonly description?: string;
                        readonly apiRestDetail?: readonly {
                          readonly id: number;
                          readonly attributes: {
                            readonly title: string;
                            readonly description?: string;
                            readonly endpoint?: string;
                          };
                        }[];
                      };
                    }[];
                  };
                };
              };
            };
            readonly guide_list_page?: {
              readonly data?: {
                readonly id: number;
                readonly attributes: {
                  readonly slug: string;
                  readonly title: string;
                };
              };
            };
            readonly tutorial_list_page?: {
              readonly data?: {
                readonly id: number;
                readonly attributes: {
                  readonly slug: string;
                  readonly title: string;
                };
              };
            };
          };
        };
      };
      readonly guidesByCategory?: readonly {
        readonly id: number;
        readonly category: string;
        readonly guides: {
          readonly data?: readonly {
            readonly id: number;
            readonly attributes: {
              readonly slug: string;
              readonly title: string;
              readonly description?: string;
              readonly mobileImage?: {
                readonly data?: {
                  readonly id: number;
                  readonly attributes: {
                    readonly url: string;
                    readonly name: string;
                    readonly alternativeText?: string;
                  };
                };
              };
              readonly image?: {
                readonly data?: {
                  readonly id: number;
                  readonly attributes: {
                    readonly url: string;
                    readonly name: string;
                    readonly alternativeText?: string;
                  };
                };
              };
              readonly listItems?: readonly string[];
            };
          }[];
        };
      }[];
      readonly bannerLinks?: readonly {
        readonly id: number;
        readonly text: string;
        readonly href: string;
        readonly icon?: {
          readonly data?: {
            readonly id: number;
            readonly attributes: {
              readonly url: string;
              readonly name: string;
              readonly alternativeText?: string;
            };
          };
        };
      }[];
      readonly seo?: {
        readonly metaTitle?: string;
        readonly metaDescription?: string;
        readonly metaImage?: {
          readonly data?: {
            readonly id: number;
            readonly attributes: {
              readonly url: string;
              readonly name: string;
              readonly alternativeText?: string;
            };
          };
        };
        readonly metaSocial?: readonly {
          readonly id: number;
          readonly title?: string;
          readonly description?: string;
          readonly image?: {
            readonly data?: {
              readonly id: number;
              readonly attributes: {
                readonly url: string;
                readonly name: string;
                readonly alternativeText?: string;
              };
            };
          };
        }[];
      };
    };
  }[];
}

export interface StrapiSolutionListPageResponse {
  readonly data: readonly {
    readonly id: number;
    readonly attributes: {
      readonly solutions: {
        readonly data?: readonly {
          readonly id: number;
          readonly attributes: {
            readonly slug: string;
            readonly title: string;
            readonly description?: string;
            readonly bannerLinks?: readonly {
              readonly id: number;
              readonly text: string;
              readonly href: string;
              readonly icon?: {
                readonly data?: {
                  readonly id: number;
                  readonly attributes: {
                    readonly url: string;
                    readonly name: string;
                    readonly alternativeText?: string;
                  };
                };
              };
            }[];
            readonly products: {
              readonly data?: readonly {
                readonly id: number;
                readonly attributes: {
                  readonly logo?: {
                    readonly data?: {
                      readonly id: number;
                      readonly attributes: {
                        readonly url: string;
                        readonly name: string;
                        readonly alternativeText?: string;
                      };
                    };
                  };
                };
              }[];
            };
            readonly icon?: {
              readonly data?: {
                readonly id: number;
                readonly attributes: {
                  readonly name: string;
                  readonly url: string;
                  readonly alternativeText?: string;
                };
              };
            };
            readonly stats?: readonly {
              readonly id: number;
              readonly value: string;
              readonly label: string;
            }[];
            readonly steps?: readonly {
              readonly id: number;
              readonly title: string;
              readonly description?: string;
              readonly products: {
                readonly data?: readonly {
                  readonly id: number;
                  readonly attributes: {
                    readonly slug: string;
                    readonly title: string;
                  };
                }[];
              };
            }[];
            readonly webinars?: {
              readonly data?: readonly {
                readonly id: number;
                readonly attributes: {
                  readonly title: string;
                  readonly description?: string;
                  readonly coverImage?: {
                    readonly data?: {
                      readonly id: number;
                      readonly attributes: {
                        readonly url: string;
                        readonly name: string;
                        readonly alternativeText?: string;
                      };
                    };
                  };
                };
              }[];
            };
            readonly caseHistories?: {
              readonly data?: readonly {
                readonly id: number;
                readonly attributes: {
                  readonly title: string;
                  readonly description?: string;
                  readonly case_histories: {
                    readonly data?: readonly {
                      readonly id: number;
                      readonly attributes: {
                        readonly title: string;
                        readonly description?: string;
                        readonly image?: {
                          readonly data?: {
                            readonly id: number;
                            readonly attributes: {
                              readonly url: string;
                              readonly name: string;
                              readonly alternativeText?: string;
                            };
                          };
                        };
                      };
                    }[];
                  };
                };
              }[];
            };
          };
        }[];
      };
      readonly caseHistories?: {
        readonly data?: readonly {
          readonly id: number;
          readonly attributes: {
            readonly title: string;
            readonly description?: string;
            readonly case_histories: {
              readonly data?: readonly {
                readonly id: number;
                readonly attributes: {
                  readonly title: string;
                  readonly description?: string;
                  readonly image?: {
                    readonly data?: {
                      readonly id: number;
                      readonly attributes: {
                        readonly url: string;
                        readonly name: string;
                        readonly alternativeText?: string;
                      };
                    };
                  };
                };
              }[];
            };
          };
        }[];
      };
      readonly features?: readonly {
        readonly id: number;
        readonly title: string;
        readonly description?: string;
        readonly items: readonly {
          readonly id: number;
          readonly title: string;
          readonly description?: string;
          readonly icon?: {
            readonly data?: {
              readonly id: number;
              readonly attributes: {
                readonly url: string;
                readonly name: string;
                readonly alternativeText?: string;
              };
            };
          };
        }[];
      }[];
      readonly seo?: {
        readonly metaTitle?: string;
        readonly metaDescription?: string;
        readonly metaImage?: {
          readonly data?: {
            readonly id: number;
            readonly attributes: {
              readonly url: string;
              readonly name: string;
              readonly alternativeText?: string;
            };
          };
        };
        readonly metaSocial?: readonly {
          readonly id: number;
          readonly title?: string;
          readonly description?: string;
          readonly image?: {
            readonly data?: {
              readonly id: number;
              readonly attributes: {
                readonly url: string;
                readonly name: string;
                readonly alternativeText?: string;
              };
            };
          };
        }[];
      };
    };
  }[];
}

// Raw Strapi response types for the full API responses
export interface StrapiGuidesResponse {
  readonly data: readonly StrapiGuide[];
  readonly meta?: {
    readonly pagination?: {
      readonly page?: number;
      readonly pageSize?: number;
      readonly pageCount?: number;
      readonly total?: number;
    };
  };
}

export interface StrapiSolutionsResponse {
  readonly data: readonly StrapiSolution[];
  readonly meta?: {
    readonly pagination?: {
      readonly page?: number;
      readonly pageSize?: number;
      readonly pageCount?: number;
      readonly total?: number;
    };
  };
}

export interface StrapiReleaseNotesResponse {
  readonly data: readonly StrapiReleaseNote[];
  readonly meta?: {
    readonly pagination?: {
      readonly page?: number;
      readonly pageSize?: number;
      readonly pageCount?: number;
      readonly total?: number;
    };
  };
}
