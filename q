[33mcommit abddfd194061dc55e98a100f0be8416084024d1d[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mDEV-1755-api-list-page-from-cms[m[33m, [m[1;31morigin/DEV-1751-create-ApiListPage-model[m[33m, [m[1;32mDEV-1751-create-ApiListPage-model[m[33m)[m
Merge: 690699e efabae1
Author: MarBert <41899883+MarBert@users.noreply.github.com>
Date:   Thu Jun 27 16:29:05 2024 +0200

    Merge branch 'main' into DEV-1751-create-ApiListPage-model

[33mcommit efabae137d6c7edcf842ff65ddcd6c1d2d8f34d2[m[33m ([m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m, [m[1;32mmain[m[33m)[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Jun 27 16:15:41 2024 +0200

    [DEV-1752] Remove bannerLinks and fix CaseHistory type in SolutionsListPage schema (#936)
    
    * Remove bannerLinks from SolutionsListPage schema
    
    * Fix caseHistories type in SolutionsListPage
    
    * Fix changeset

[33mcommit 690699eeaba8dfe7d525d4d39f26e7c93cbc9632[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Thu Jun 27 15:46:22 2024 +0200

    update changeset

[33mcommit 2e537209e18fd6f920f64ad14b224b246bfba04e[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Thu Jun 27 15:43:35 2024 +0200

    add banner links to api list page model

[33mcommit dab32d47ae83aaa5f47f7fc7106e2e5084a16fd7[m
Merge: f0766a1 ce71269
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Thu Jun 27 15:36:27 2024 +0200

    Merge branch 'main' into DEV-1751-create-ApiListPage-model

[33mcommit f0766a1566d49854cc0294a3ad05f961f5e1fa15[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Thu Jun 27 15:30:32 2024 +0200

    Add relations

[33mcommit ce71269094b82600b1b83d19138060ddb68c4be5[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jun 27 11:49:10 2024 +0200

    [DEV-1690] Add solution page (#908)
    
    * feat(DEV-1677): add quote component
    
    * chore: add changeset
    
    * Add QuickStart codec and refactor homepage
    
    * fix linting
    
    * fix linting
    
    * add changeset
    
    * Update component to manage quick start page
    
    * refactor content
    
    * add changeset
    
    * fix build issue
    
    * connect api tester part
    
    * remove commented code
    
    * feat(DEV-1677): fix PR comments
    
    * add next intl context wrapper
    
    * add SolutionPreviewCard
    
    * add SolutionPreviewCard story
    
    * update tsconfig
    
    * add SolutionStep component
    
    * add label
    
    * Create gentle-snails-sparkle.md
    
    * Create pink-onions-swim.md
    
    * use theme color
    
    * replace Chip with Tag component
    
    * refactor breadcrumbs helper
    
    * update part renderer
    
    * add case history template
    
    * fix padding
    
    * add change set
    
    * Wip add solution page
    
    * Fix story template name
    
    * add stats component
    
    * Align style
    
    * add change set
    
    * add stats component
    
    * Fix quote
    
    * Fix after review
    
    * [DEV-1688] fix storybook env (#898)
    
    * feat(DEV-1688): fix .env error on Storybook
    
    * chore: add changeset
    
    * feat(DEV-1688): add AuthProvider
    
    * Add case history page
    
    * add case histories codec and tests
    
    * add case history fetch
    
    * add case history page
    
    * Fix PR and stories
    
    * Fix margin
    
    * Fix margin breadcrumbs
    
    * Fix stats
    
    * Add decorator
    
    * remove unused import
    
    * Add auth provider
    
    * Fix alignments
    
    * Fix margin bottom
    
    * add solutions codec
    
    * uncomment codec
    
    * add map function codec to solution props
    
    * Unify media type to strapi media
    
    * Fix solution stories
    
    * add media
    
    * Fix codec
    
    * add solutions fetch
    
    * Add solution page
    
    * Fix linting issue
    
    * add change set
    
    * remove console log
    
    * Replace null with undefined in bannerLinks hardcoded content
    
    * Add bannerLinks to makeSolutionsProps to see the bannerLinks section in the solution page
    
    * Fix bannerLinks hardcoded property name
    
    * Rename body to content in BannerLink's codec and props
    
    * Fix changeset
    
    ---------
    
    Co-authored-by: Michele Da Rin Fioretto <michele.darinfioretto@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
    Co-authored-by: jeremygordillo <jere.gordi@gmail.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>

[33mcommit b4b7c2b6ff87642052d98fc0adb7045d3ae9106d[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Jun 27 11:33:35 2024 +0200

    [DEV-1748] Add bannerLinks to solution entity in Strapi (#928)
    
    * Add bannerLinks to solution entity in Strapi
    
    * Add theme field to bannerLink component in Strapi
    
    * Rename body to content in bannerLink component

[33mcommit e3a57a4c93f670595866b746a1f4b9c6a15c2c36[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Jun 27 11:14:15 2024 +0200

    [DEV-1749] Fix getTutorialPaths output to avoid NormalizeError: Requested and resolved page mismatch (#929)
    
    * Fix getTutorialPaths output to avoid NormalizeError: Requested and resolved page mismatch
    
    * Add changeset

[33mcommit 757ddc566dee577c988ee9ff66742245e11c5099[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Jun 26 17:56:28 2024 +0200

    [DEV-1750] Remove domsanitizer from typography part (#931)
    
    * Remove DOMPurify.sanitize from TypographyPart component
    
    * Add changeset

[33mcommit 5fd8b76c17398c0902f2db82ff25197acf8bd244[m
Merge: 0d50974 a17b6e5
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Wed Jun 26 17:49:20 2024 +0200

    Merge branch 'DEV-1747-create-ApiData-model' into DEV-1751-create-ApiListPage-model

[33mcommit a17b6e5a220de5ba1df1ed3f53db1a5c9a77886a[m[33m ([m[1;32mDEV-1747-create-ApiData-model[m[33m)[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Wed Jun 26 17:48:45 2024 +0200

    add required fields

[33mcommit 0d509747775ea3b8cf9288963ef7b5070d456115[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Wed Jun 26 17:40:28 2024 +0200

    Add ApiListPage model

[33mcommit afad5e7da205be33d8d98ae7e23b06005c68ca25[m
Merge: 09ec17f cba50f2
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Wed Jun 26 17:18:13 2024 +0200

    Merge branch 'main' into DEV-1751-create-ApiListPage-model

[33mcommit 09ec17f00fc719980ee54cdb5560041cfe4b460a[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Wed Jun 26 15:41:08 2024 +0200

    Update changeset

[33mcommit 4319e79277aa5685b8c9a534a29328be2a12ffcc[m
Merge: 09ec17f cba50f2
Author: MarBert <41899883+MarBert@users.noreply.github.com>
Date:   Wed Jun 26 14:52:44 2024 +0200

    Merge branch 'main' into DEV-1747-create-ApiData-model

[33mcommit f01879c024294213c08aea4c2caec566a32f38e1[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Tue Jun 25 19:04:42 2024 +0200

    rename tags to tag

[33mcommit dc96b4437319039a8c68eebee3a7f8d9e5f50d3a[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Tue Jun 25 19:04:10 2024 +0200

    add specurls and tag

[33mcommit 91f834f4a49238ad3db5b666b508bc5832451a88[m
Author: Marcello Bertoli <marcello.bertoli@uqido.com>
Date:   Tue Jun 25 18:09:43 2024 +0200

    Add base ApiData

[33mcommit cba50f23170f87c4e979dc8b7dcc01a5f559c889[m
Author: MarBert <41899883+MarBert@users.noreply.github.com>
Date:   Tue Jun 25 16:11:46 2024 +0200

    [DEV-1724] [DEV-1701] refactor layout banner links and update bannerlink input prop and layout (#923)
    
    * move bannerLinks to atoms, update imports
    
    * refactor prop for bannerlink
    
    * fix ul tag order, add margins, add max width
    
    * add title, need update to icon
    
    * fix issue in appIO content
    
    * refactor icon to accept string or object
    
    * fix banner link layout, fix content
    
    * remove unused imports
    
    * refactor to icon received from strapi
    
    * add comment for clarification
    
    * add typeof mediacodec to image in props
    
    * update banner links to keep text inside reading area
    
    * fix to layout and refactor
    
    * fix bannerlinks with 3 options width
    
    * fix contents props
    
    * update changeset
    
    * update storybook for bannerlink
    
    * remove useless images and indentifiers
    
    * fix import in SolutionPageTemplate
    
    * add default value for width and justify
    
    * remove empty content
    
    * add linting to storybook
    
    * Add media type to icon, update contents and storybook, add svg icons
    
    * remove stories useles fields, revert mockimage
    
    * remove linting rules, reverted package-lock
    
    * Fix storybook url mock content
    
    * remove usless import
    
    * fix linting in bannerlink, fix import error in case history page tamplate
    
    * update svg color to white, fix storybook mock content
    
    * simplify banner links to show a maximum of two banner links
    
    * add local icon reference for storybook
    
    * Reafactor code and property names
    
    * Refactor imports in stories, code cleanup
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 021b82b2b417e631745bee2368225899fa9ba129[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Tue Jun 25 11:27:48 2024 +0200

    [DEV-1627] Refactor tutorial (#900)
    
    * backend webinars
    
    * Update apps/strapi-cms/src/api/tutorial/content-types/tutorial/schema.json
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/strapi-cms/src/api/tutorial/content-types/tutorial/schema.json
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/strapi-cms/src/api/tutorial/content-types/tutorial/schema.json
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * missing fields
    
    * banner links
    
    * Update apps/strapi-cms/src/api/tutorial/controllers/tutorial.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * pr changes
    
    * changeset
    
    * typo
    
    * remove name
    
    * test and codec wip
    
    * tutorial codec
    
    * changeset
    
    * remove name and dir name
    
    * wip
    
    * Fix codec
    
    * Add make tutorial props
    
    * Fix codec fix fetch from strapi
    
    * Render both static and cms tutorials
    
    * Fix type issue
    
    * remove cooming soon attribute
    
    * Fix page
    
    * add change set
    
    * Fix after review
    
    * Add TutorialPageTemplate
    
    * Remove redundant constant and fix linting error
    
    * Add productSlug filter to getTutorialsProps
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>

[33mcommit 5cfb0e6ac09b39cc44026c166649ff1c502584d7[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Jun 21 16:43:56 2024 +0200

    [DEV-1741] Add linter to Storybook workspace (#925)
    
    * Add linter to Storybook workspace
    
    * Add linter to Storybook workspace
    
    * Apply linting rules to mock-content helper

[33mcommit 4f589660001893ef39cfebb0d08154d2e2d58dfd[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Jun 21 16:15:01 2024 +0200

    [DEV-1729] Set a longer OTP duration (#922)
    
    * Set otp duration to 15 minutes
    
    * feat: changed otp duration in cognito client
    
    * Remove useless new lines
    
    * Add changeset
    
    ---------
    
    Co-authored-by: christian-calabrese <christian.calabrese@pagopa.it>

[33mcommit 89c4b66063b9b69a3bb6625d71b8fee066273cda[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Jun 20 14:23:32 2024 +0200

    [DEV-1702] Optimize sync to aws s3 during deploy (#902)
    
    * Optimize sync to aws s3 during deploy
    
    * Parallelize sync commands to transfer files to aws s3 bucket
    
    * feat: added --only-show-errors to s3 sync command
    
    ---------
    
    Co-authored-by: christian-calabrese <christian.calabrese@pagopa.it>

[33mcommit 393e8e7b15948e454a8e407b45bc0623c751842b[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Thu Jun 20 14:19:19 2024 +0200

    [DEV-1703] Optimize gitbook docs download (#918)
    
    * fix: downloading docs with checkout action instead of zip
    
    * fix: added cache cleaning workflow
    
    * fix: checking cache deletion concurrency
    
    * fix: added error ignore in delete_cache workflow
    
    * fix: use cache action instead of restore cache
    
    * fix: use cache action instead of restore cache
    
    * fix: yaml indent
    
    * fix: deleting old docs before build
    
    * fix: added debug ls
    
    * fix: setting working-directory
    
    * fix: setting working-directory
    
    * fix: setting working-directory
    
    * fix: removed caching
    
    * fix: removed concurrency check

[33mcommit 8eee224a4bdaee03ccfe1bac29d61935f66941b5[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Thu Jun 20 14:13:30 2024 +0200

    [DEV-1733] Fix content deploy action (#921)
    
    * fix: avoided concurrency when creating latest tag
    
    * fix: using PAT in changelog to allow trigger of move latest tag action
    
    * feat: allow manual run of move_latest_tag workflow
    
    * fix: condition

[33mcommit 131e95ec0896fa7c391dad0979a5f922c0cd3c74[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Jun 19 10:17:48 2024 +0200

    [DPC-232] Version update "Manuale Operativo" SEND (#920)
    
    * [DPC-232] Version main update main "Manuale Operativo" SEND
    
    * Create stale-walls-wait.md

[33mcommit 4028890f63b9761fe657bac6cdacc362436b5cfb[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Thu Jun 13 09:10:40 2024 +0200

    chore: removed dgs iam users (#914)

[33mcommit 66da6a8b19b0d68ff501e97824be00f734706193[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.10.0[m[33m, [m[1;33mtag: [m[1;33mstorybook-app@0.2.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.26.0[m[33m, [m[1;33mtag: [m[1;33minfrastructure@0.7.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Tue Jun 11 14:56:20 2024 +0200

    Update CHANGELOG and prepare next release (#901)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 40977c44e5814ee01c7defb20b55f03ed3e73bd4[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Tue Jun 11 12:49:23 2024 +0200

    [DEV-1691] Add case history page (#903)
    
    * feat(DEV-1677): add quote component
    
    * chore: add changeset
    
    * Add QuickStart codec and refactor homepage
    
    * fix linting
    
    * fix linting
    
    * add changeset
    
    * Update component to manage quick start page
    
    * refactor content
    
    * add changeset
    
    * fix build issue
    
    * connect api tester part
    
    * remove commented code
    
    * feat(DEV-1677): fix PR comments
    
    * refactor breadcrumbs helper
    
    * update part renderer
    
    * add case history template
    
    * fix padding
    
    * add change set
    
    * Fix story template name
    
    * Fix quote
    
    * Fix after review
    
    * Add case history page
    
    * add case histories codec and tests
    
    * add case history fetch
    
    * add case history page
    
    * Fix PR and stories
    
    * Fix margin
    
    * Fix margin breadcrumbs
    
    * add change set
    
    * Add EContainer direction in CaseHistoryPageTemplate
    
    ---------
    
    Co-authored-by: Michele Da Rin Fioretto <michele.darinfioretto@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>

[33mcommit fa708e2e26e0251cb1747e2e4b699c46f334f541[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Jun 10 15:55:21 2024 +0200

    [DEV-1668] Add solution page template (#890)
    
    * feat(DEV-1677): add quote component
    
    * chore: add changeset
    
    * Add QuickStart codec and refactor homepage
    
    * fix linting
    
    * fix linting
    
    * add changeset
    
    * Update component to manage quick start page
    
    * refactor content
    
    * add changeset
    
    * fix build issue
    
    * connect api tester part
    
    * remove commented code
    
    * feat(DEV-1677): fix PR comments
    
    * add next intl context wrapper
    
    * add SolutionPreviewCard
    
    * add SolutionPreviewCard story
    
    * update tsconfig
    
    * add SolutionStep component
    
    * add label
    
    * Create gentle-snails-sparkle.md
    
    * Create pink-onions-swim.md
    
    * use theme color
    
    * replace Chip with Tag component
    
    * refactor breadcrumbs helper
    
    * update part renderer
    
    * add case history template
    
    * fix padding
    
    * add change set
    
    * Wip add solution page
    
    * Fix story template name
    
    * add stats component
    
    * Align style
    
    * add change set
    
    * add stats component
    
    * [DEV-1688] fix storybook env (#898)
    
    * feat(DEV-1688): fix .env error on Storybook
    
    * chore: add changeset
    
    * feat(DEV-1688): add AuthProvider
    
    * Fix stats
    
    * Add decorator
    
    * remove unused import
    
    * Add auth provider
    
    * Fix alignments
    
    * Fix margin bottom
    
    * Fix Stats component vertical padding
    
    * add change set
    
    ---------
    
    Co-authored-by: Michele Da Rin Fioretto <michele.darinfioretto@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
    Co-authored-by: jeremygordillo <jere.gordi@gmail.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>

[33mcommit 76913d2b5af09eca4d8535baec14198dd33d5245[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Jun 10 15:00:01 2024 +0200

    [DEV-1717] Fix update-docs script (#906)
    
    * Fix update-docs script
    
    * Fix update-docs script and .gitmodule
    
    * Add changeset
    
    * Fix commands to README.md
    
    * Fix fetch-local-docs.sh
    
    * Fix fetch-local-docs.sh and README.md
    
    * Fix README.md update docs instructions

[33mcommit 75c2a06654a006ea0c30feef60c50103335888f0[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Jun 10 12:34:47 2024 +0200

    [DEV-1690] update solutions model (#907)
    
    * update solutions model
    
    * Add change set
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 2411a44ec5099ac23396476bf9e495446cdbf304[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Mon Jun 10 11:25:09 2024 +0200

    [DEV-1683] implemented GH workflows to create and use latest tag (#895)
    
    * feature: implemented GH workflows to move the latest tag and deploy contents on latest tag from strapi
    
    * fix: changed new workflow name
    
    * fix: updated version of checkout action in move_latest_tag
    
    * feature: changed github workflow dispatched by strapi in production
    
    * feat: added changeset
    
    * fix: move_latest_tag workflow minor issues

[33mcommit 6b31e7cc2437c7751dbb170b3c34e503dec7d7a9[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Jun 7 14:08:39 2024 +0200

    [DEV-1671] add stats component (#896)
    
    * add stats component
    
    * Align style
    
    * add change set
    
    * Fix stats
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 330590a9590c150cbb32d45a8691957711411c3c[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Jun 6 19:04:22 2024 +0200

    [DPC-229] Add new guide to SEND (#904)
    
    * [DPC-229] Add new guide to SEND
    
    * Create heavy-actors-raise.md
    
    * Add new guide in list
    
    * Add variable for new guide
    
    * Fix linting and missing brackets
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit e35778cb3df545e546f91a69b25634e145c84f68[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Jun 6 18:32:41 2024 +0200

    [DPC-208] Add new tutorial IO (#905)
    
    * [DPC-208] Add new tutorial IO
    
    New tutorial and image in IO "panoramica" and in ltutorial list
    
    * Add new tutorial and change sorting&display in "Panoramica"
    
    * Create green-actors-marry.md
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit f20337c57f4b0ebe927f4fd75a23aa44bfe68c19[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Thu Jun 6 17:33:32 2024 +0200

    [DEV-1634] submodule poc (#843)
    
    * submodule poc
    
    * update script
    
    * Update .gitignore
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * changeset
    
    * Update apps/nextjs-website/scripts/fetch-local-docs.sh
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * remove docs directory before initializing submodule
    
    * pr comment
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 34be7420759208a68082084d2ccfdb8a7e5df6c9[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jun 6 15:05:00 2024 +0200

    [DEV-1675] Add case history template (#889)
    
    * feat(DEV-1677): add quote component
    
    * chore: add changeset
    
    * Add QuickStart codec and refactor homepage
    
    * fix linting
    
    * fix linting
    
    * add changeset
    
    * Update component to manage quick start page
    
    * refactor content
    
    * add changeset
    
    * fix build issue
    
    * connect api tester part
    
    * remove commented code
    
    * feat(DEV-1677): fix PR comments
    
    * refactor breadcrumbs helper
    
    * update part renderer
    
    * add case history template
    
    * fix padding
    
    * add change set
    
    * Fix story template name
    
    * Fix quote
    
    * Fix after review
    
    * Fix PR and stories
    
    * Fix margin
    
    * Fix margin breadcrumbs
    
    ---------
    
    Co-authored-by: Michele Da Rin Fioretto <michele.darinfioretto@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>

[33mcommit d8a564ee7f3eb0b785e65eea0fa9d19066f57b99[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Thu Jun 6 13:09:31 2024 +0200

    [DEV-1660] Add tab component (#897)
    
    * tab component
    
    * changeset
    
    * rename_component
    
    * Update apps/storybook-app/stories/atoms/TabComponent.stories.tsx
    
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
    
    * pr comments
    
    * Update apps/nextjs-website/src/components/atoms/TabComponent/TabComponent.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/components/atoms/TabComponent/TabComponent.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/components/atoms/TabComponent/TabComponent.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/components/atoms/TabComponent/TabComponent.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/components/atoms/TabComponent/TabComponent.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 4a477d093b99ee916052f64f1267fb265a4fb08f[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Jun 6 09:45:34 2024 +0200

    [DEV-1664]: add SolutionsTemplate (#892)
    
    * feat(DEV-1664): add SolutionsTemplate
    
    * chore: add changeset
    
    * feat(DEV-1664): fix SolutionsTemplate
    
    * feat(DEV-1664): remove comment
    
    * feat(DEV-1664): fix margin
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 004b4835e938f1109cea3f33f55815acc7f52116[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Jun 5 12:44:01 2024 +0200

    [DEV-1455] Add tutorials to Strapi (#841)
    
    * backend webinars
    
    * Update apps/strapi-cms/src/api/tutorial/content-types/tutorial/schema.json
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/strapi-cms/src/api/tutorial/content-types/tutorial/schema.json
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/strapi-cms/src/api/tutorial/content-types/tutorial/schema.json
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * missing fields
    
    * banner links
    
    * Update apps/strapi-cms/src/api/tutorial/controllers/tutorial.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * pr changes
    
    * changeset
    
    * typo
    
    * remove name
    
    * remove name and dir name
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 61b7b51fdb0647959cd9cc02cfc1fcd3efcc47f3[m[33m ([m[1;33mtag: [m[1;33mstrapi-provider-upload-custom@0.2.1[m[33m, [m[1;33mtag: [m[1;33mstorybook-app@0.1.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.25.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Tue Jun 4 17:45:58 2024 +0200

    Update CHANGELOG and prepare next release (#894)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 28118e1bc8ecacbe16ade2281a3f0dce46412728[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Jun 4 17:38:40 2024 +0200

    [DEV-1697] Fix anchor position on scroll (#899)
    
    * Fix anchor position on scroll
    
    * Replace hardcoded scroll offset with a constant
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>

[33mcommit 192117c006f794842aea5648e6f6dfe312e88f54[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Tue Jun 4 15:06:31 2024 +0200

    [DEV-1641] Fix compile error of strapi-provider-upload-custom (#886)
    
    * Fix compile error of strapi-provider-upload-custom
    
    * Create wicked-clocks-provide.md
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>

[33mcommit 2f2ef3716a6ca7b8d3118eb7071759147153a8ac[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Mon Jun 3 17:14:53 2024 +0200

    [DEV-1669] Solution Preview Card (#887)
    
    * add next intl context wrapper
    
    * add SolutionPreviewCard
    
    * add SolutionPreviewCard story
    
    * update tsconfig
    
    * add SolutionStep component
    
    * add label
    
    * Create gentle-snails-sparkle.md
    
    * Create pink-onions-swim.md
    
    * use theme color
    
    * use theme color
    
    * replace Chip with Tag component
    
    * Update apps/nextjs-website/src/components/molecules/SolutionStep/SolutionStep.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/components/molecules/SolutionPreviewCard/SolutionsPreviewCard.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>

[33mcommit ffd196be51f5d807224e70fe6028f2d52e6650ed[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Jun 3 15:52:17 2024 +0200

    [DEV-1626] Show quickstart from cms (#883)
    
    * Add QuickStart codec and refactor homepage
    
    * fix linting
    
    * fix linting
    
    * add changeset
    
    * Update component to manage quick start page
    
    * refactor content
    
    * add changeset
    
    * fix build issue
    
    * connect api tester part
    
    * remove commented code
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 32f7b1498eb8fef0b97cbdf6b0d002d0baeaadf3[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Jun 3 15:11:45 2024 +0200

    [DEV-1626] Add QuickStart codec and refactor homepage (#882)
    
    * Add QuickStart codec and refactor homepage
    
    * fix linting
    
    * fix linting
    
    * add changeset
    
    * fix build issue
    
    * Apply suggestions from code review
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 66761319fb9054593205cbe2ef45b67139dd5432[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.9.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon Jun 3 14:16:33 2024 +0200

    Update CHANGELOG and prepare next release (#893)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 9892f6b5ee42e4c7d4952f208034a8a5a197e680[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri May 31 11:37:01 2024 +0200

    [DEV-1686]: fix Strapi relations naming (#891)
    
    * fix(DEV-1686): fix Strapi relations naming
    
    * chore: add changeset

[33mcommit 9bc1b48cb0bb9831373b79a390a4b833eba65693[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.9.0[m[33m, [m[1;33mtag: [m[1;33mstorybook-app@0.0.3[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.24.0[m[33m, [m[1;33mtag: [m[1;33minfrastructure@0.6.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri May 31 09:34:23 2024 +0200

    Update CHANGELOG and prepare next release (#879)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 293f5cc72a31277e31039c625c3d8f5a9a37537b[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri May 31 08:57:42 2024 +0200

    [DEV-1681] Add solutions page (#885)
    
    * backend webinars
    
    * QuickstartGuide and QuickstartGuideItem
    
    * linting autogenerated code
    
    * changeset
    
    * missing fields
    
    * blocks
    
    * add type
    
    * Remove tutorial from PR
    
    * Update quickstart guide and parts
    
    * Refactor use  text for description and add required
    
    * Apply suggestions from code review
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * add icon to parts
    
    * add quote parts
    
    * Add case histories
    
    * Fix linting
    
    * add changeset
    
    * add common components
    
    * add solutions and update relationships
    
    * Add change set
    
    * Fix linting
    
    * Add solutions Page
    
    * add change set
    
    * fix lint issue
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 658e9e3faa070de00c691259733a24ae52e07533[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri May 31 08:39:47 2024 +0200

    [DEV-1673] Add solutions (#884)
    
    * backend webinars
    
    * QuickstartGuide and QuickstartGuideItem
    
    * linting autogenerated code
    
    * changeset
    
    * missing fields
    
    * blocks
    
    * add type
    
    * Remove tutorial from PR
    
    * Update quickstart guide and parts
    
    * Refactor use  text for description and add required
    
    * Apply suggestions from code review
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * add icon to parts
    
    * add quote parts
    
    * Add case histories
    
    * Fix linting
    
    * add changeset
    
    * add common components
    
    * add solutions and update relationships
    
    * Add change set
    
    * Fix linting
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit af00272b8a9a8a2ace74f2d235e99ac847d455d9[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu May 30 17:27:15 2024 +0200

    [DEV-1676] Add case histories (#881)
    
    * backend webinars
    
    * QuickstartGuide and QuickstartGuideItem
    
    * linting autogenerated code
    
    * changeset
    
    * missing fields
    
    * blocks
    
    * add type
    
    * Remove tutorial from PR
    
    * Update quickstart guide and parts
    
    * Refactor use  text for description and add required
    
    * Apply suggestions from code review
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * add icon to parts
    
    * add quote parts
    
    * Add case histories
    
    * Fix linting
    
    * add changeset
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit c7eb7c73156121faea7ff7ac77a8317432b757eb[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu May 30 16:55:53 2024 +0200

    [DEV-1677]: add quote component (#880)
    
    * feat(DEV-1677): add quote component
    
    * chore: add changeset
    
    * feat(DEV-1677): fix PR comments
    
    * feat(DEV-1677): fix PR comments
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit fe05e7061f6986e8f5238aab13835dcab7658051[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu May 30 16:38:46 2024 +0200

    [DEV-1663]: refactor cta cards (#877)
    
    * feat(DEV-1663): add products prop on CtaCard
    
    * chore: add changeset
    
    * feat(DEV-1663): rename products prop
    
    * chore: update changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit ce380cf2d9110b5d60877c94a27104ea79c561dd[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu May 30 15:56:42 2024 +0200

    [DEV-1665]: refactor Feature component to use dark style programmatically (#876)
    
    * feat(DEV-1665): refactor Feature component
    
    * chore: add changeset
    
    * feat(DEV-1665): rename variable
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 088eadf8ac9a0c43e6f243393dcce20c500079a5[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu May 30 15:35:29 2024 +0200

    [DEV-1609]: fix quick start icons colors (#871)
    
    * fix(DEV-1609): update quickstarts' icons colors
    
    * chore: add changeset
    
    * chore: update changeset
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * chore: update changeset
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit f1a2f65d7902392b7eb46b05af7707acdd8abdaa[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu May 30 14:38:33 2024 +0200

    [DEV-1640]: add website's atoms stories (#865)
    
    * feat(DEV-1640): add atoms stories
    
    * chore: add changeset
    
    * feat(DEV-1640): remove stories
    
    * feat(DEV-1640): remove stories
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 0d7a50b19ed717efc6cb9865af8e5af75e4597f0[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Wed May 29 12:33:49 2024 +0200

    [EC-310] -  host authenticated user now can subscribe to webinar (#873)
    
    * fix: host authenticated user now can subscribe to webinar
    
    * docs: added changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit b00f56f713dae908c68588e8da62469fe8cca8c2[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed May 29 12:12:03 2024 +0200

    [DEV-1261] Add quickstart guide strapi side (#842)
    
    * backend webinars
    
    * QuickstartGuide and QuickstartGuideItem
    
    * linting autogenerated code
    
    * changeset
    
    * missing fields
    
    * blocks
    
    * add type
    
    * Remove tutorial from PR
    
    * Update quickstart guide and parts
    
    * Refactor use  text for description and add required
    
    * Apply suggestions from code review
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update code-block.json
    
    refactor change string to enum
    
    ---------
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 25b28b143afdffbb40db5735a8ee1f65842fc946[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed May 29 10:50:49 2024 +0200

    [DEV-859] Breadcrumbs (#867)
    
    * add BreadCrumb type
    
    * add translations
    
    * refactor breadcrumbs helper
    
    * add breadcrumbs to guides
    
    * add breadcrumbs to quick start
    
    * add breadcrumbs to tutorials
    
    * add breadcrumbs to webinars
    
    * update breadcrumbs components
    
    * update ProductLayout styles
    
    * update ProductBreadcrumbs styles
    
    * add breadcrumbs to API pages
    
    * add breadcrumbs to guides pages
    
    * add breadcrumbs to tutorials pages
    
    * Create smart-pens-work.md
    
    * fix breadcrumbs styles on webinar details page

[33mcommit 413e10a9885ecc9ce1d47221038dab03fed27d37[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Tue May 28 17:48:43 2024 +0200

    [DEV-1682]: fix webinars' images responsiveness (#878)
    
    * fix(DEV-1682): add imageStyle prop to BlocksRendererClient
    
    * chore: add changeset

[33mcommit 28568be639d161d56fb57438210f87cfaf3b8650[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.23.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Tue May 28 11:28:27 2024 +0200

    Update CHANGELOG and prepare next release (#875)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit e3e55d5b129e9310c4b887bb8075169752380c74[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Mon May 27 18:16:26 2024 +0200

    [DEV-1680]: fix webinars paragraphs (#874)
    
    * fix(DEV-1680): fix webinars paragraphs
    
    * chore: add changeset

[33mcommit deeabb39c7559a0af68487a13687127706f91a0c[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Mon May 27 16:54:00 2024 +0200

    [EC-310] - Create S3 knowledge base (#872)
    
    * fix: removed chatbot s3 bucket to change region
    
    * fix: removed chatbot s3 bucket to change region
    
    * fix: added tags and chatbot bucket
    
    * fix: added tags and chatbot bucket
    
    * feat: added lambda and sqs for sync
    
    * fix: fixed website_kb_sync_lambda
    
    * chore: formatted lambda
    
    * fix: moved chatbot resources to eu-west-3
    
    * fix: removed lambda, sqs and s3 notifications
    
    * feat: syncing kb s3 objects from the build phase
    
    * chore: removed unused log_retention_days variable
    
    * revert: removed edits to github actions and lambda code
    
    * feat: chatbot resources are created only in dev environment
    
    * chore: format
    
    * chore: using module variable in kb bucket name

[33mcommit d1d8fa9c416148fd60868a5b6541fcd00ea7d7f3[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Mon May 27 09:09:18 2024 +0200

    [EC-310] Revise terraform code structure to follow engineering standard (#870)
    
    * feat: create bucket containing ai knowledge base
    
    * chore: applying newly introduced engineering standards for terraform repository structure
    
    * fix: formatted modules
    
    * fix: added missing providers to modules
    
    * fix: added missing providers to modules
    
    * fix: added missing providers to modules
    
    * feat: subdivided in cms, website and chatbot
    
    * fix: added moved.tf file containing the moves from old repo structure to the new
    
    * fix: update terraform lock
    
    * feat: returning name servers records as output
    
    * fix: some resources not moved correctly
    
    * fix: some resources not moved correctly
    
    * fix: moving production website certificate records
    
    * chore: changed modules folder from _modules to modules

[33mcommit 4f6aebffea7851bc178fe12eaa91816d8f351231[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.8.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.23.0[m[33m, [m[1;33mtag: [m[1;33meslint-config-custom@0.1.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Thu May 23 10:35:21 2024 +0200

    Update CHANGELOG and prepare next release (#864)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 187179445a65b3021e62ba0c2557b995283fb3ec[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed May 22 10:27:27 2024 +0200

    [DEV-1631] Add slug custom uniq validator (#851)
    
    * add custom validator for slug uniqueness
    
    * add changeset
    
    * Add strapi config
    
    * Update strapi files according to config and remove eslint-disable
    
    * Fix after review
    
    * Update strapi rules and files
    
    * remove lint disable
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit b62267ea4bf3fbfade07de7c018bdf15544e5aff[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed May 22 09:51:18 2024 +0200

    [DEV-1594] Update strapi linting rules (#857)
    
    * Add strapi config
    
    * Update strapi files according to config and remove eslint-disable
    
    * Update strapi rules and files
    
    * add changeset
    
    * Update .changeset/popular-phones-tap.md
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 5d8ef2a046fa5d92816e375985c11de7f6add1e5[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed May 22 09:32:01 2024 +0200

    [DEV-1617, DEV-1619]: move webinars subscriptions to DynamoDB (#855)
    
    * feat(DEV-1617): move webinars subscriptions to DynamoDB
    
    * chore: add changeset
    
    * feat(DEV-1617): add unit tests
    
    * feat(DEV-1617): resolve PR comments
    
    * feat(DEV-1617): resolve PR comments
    
    * feat(DEV-1617): use username instead of user email
    
    * feat(DEV-1617): add createdAt field
    
    * chore: fix typo
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * chore: fix typo
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * feat(DEV-1617): fix bug
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit cb65ce30928ff25569eaf1d75cee0493b95ce60f[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Mon May 20 17:46:21 2024 +0200

    [DEV-1618] Import webinar subscriptions to ddb script (#866)
    
    * feat: implemented subscriptions migration script with tests
    
    * fix: changed webinar subscriptions import folder name
    
    * docs: set minimum python version required

[33mcommit 8bb93da51d00ac6d13a09b7e2bdf94e18ba9ad53[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu May 16 15:09:02 2024 +0200

    [DEV-1607] Update Strapi to version 4.24.2 (#854)
    
    * Update Strapi to version 4.24.2
    
    * Update package-lock.json after merge

[33mcommit 93765407489759c675117ebf76f9bc2660e93769[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu May 16 13:02:17 2024 +0200

    [DEV-1628] Strapi SEO Plugin (#860)
    
    * add & enable seo plugin
    
    * add seo component to homepage content type
    
    * Create purple-pianos-work.md
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit f1442cb1df034ec6989a800e81b547cefff96569[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu May 16 10:32:39 2024 +0200

    [DEV-1339]: fix tutorial page style (#839)
    
    * feat(DEV-1339): fix tutorial page style
    
    * chore: add changeset
    
    * Update apps/nextjs-website/src/app/[productSlug]/tutorials/[...productTutorialPage]/page.tsx
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    
    * Update apps/nextjs-website/src/app/[productSlug]/tutorials/[...productTutorialPage]/page.tsx
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    
    * feat(DEV-1339): fix PR comments
    
    * feat(DEV-1139): add relatedlinks to tutorial
    
    * feat(DEV-1139): fix PR comments
    
    * feat(DEV-1339): fix PR comments
    
    * feat(DEV-1339): fix PR comments
    
    * feat(DEV-1339): fix PR comments
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 23d9d7b00d30ddbfbc8ed693a240b1e54425abbc[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.22.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed May 15 17:09:05 2024 +0200

    Update CHANGELOG and prepare next release (#861)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 38eb465c8fd89b4966b229b601afb7e3928d93f9[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed May 15 15:50:00 2024 +0200

    Fix thirty-fireants-deny.md (#863)

[33mcommit d08067956d536d695f0ce02b07e183e713979564[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed May 15 10:29:09 2024 +0200

    [DPC-227] Version Update Guida Tecnica IO (#862)
    
    * [DPC-227] Version Update Guida Tecnica IO
    
    * Create fair-crews-worry.md
    
    * fix linting
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit f1e20f8c1b1d1adf6588cf6807806bc3cb4a65e2[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed May 15 10:16:55 2024 +0200

    [DEV-1590] Replacement images PagoPALAB (#859)
    
    * [DEV-1590] Replacement images PagoPALAB
    
    Replacement of placeholder images with definitive ones for PagoPALAB
    
    * Create thirty-fireants-deny.md
    
    * [DEV-1590] Change image size for TARI
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit ffc7a6b3d85b52458760f1e313d638a63171c5c7[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed May 15 09:48:09 2024 +0200

    [DPC-225] Version update "Manuale Servizi". IO (#858)
    
    * [DPC-225] Version update "Manuale Servizi". IO
    
    * Create large-pots-count.md
    
    * [DPC-225]

[33mcommit ff29b3fee865fd206c11e87a32b33ab72a3300f3[m[33m ([m[1;33mtag: [m[1;33mstrapi-provider-upload-custom@0.2.0[m[33m, [m[1;33mtag: [m[1;33mstrapi-cms@0.7.0[m[33m, [m[1;33mtag: [m[1;33mstorybook-app@0.0.2[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.21.0[m[33m, [m[1;33mtag: [m[1;33minfrastructure@0.5.8[m[33m, [m[1;33mtag: [m[1;33mgitbook-docs@0.2.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon May 13 15:46:49 2024 +0200

    Update CHANGELOG and prepare next release (#835)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit f45acd8c62bb22588782c188df8538d12939e42d[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Mon May 13 15:26:09 2024 +0200

    [DEV-1636]: Update devportal_authenticated_user IAM role (#856)
    
    * feat(DEV-1617): update iam role
    
    * chore: add changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit e931eb7e7a38a9abe7e6e135f3f18cb382a7c1e8[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon May 13 14:10:36 2024 +0200

    [DPC-221] Add 2 new versions for KB SEND (#853)
    
    * [DPC-221] Add 2 new versions for KB SEND
    
    * Create serious-snakes-enjoy.md
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 2bb479500851b385f136a5c4c7c3ab5b44a514c4[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Mon May 13 10:22:14 2024 +0200

    [DEV-1508]: align news showcase on homepage (#850)
    
    * fix(DEV-1508): align news showcase on homepage
    
    * chore: add changeset
    
    * fix(DEV-1508): fix PR comments
    
    * feat(DEV-1524): add padding on small screens

[33mcommit c84b885a139558d42838c69ac0b897a1d1f70f21[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri May 10 12:16:15 2024 +0200

    [DEV-1625] Fix links to selfcare backoffice (#849)
    
    * Fix links to selfcare backoffice
    
    * Add changeset

[33mcommit 49057cd07a741658c82baf3783d00c4b9949d125[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu May 9 17:43:44 2024 +0200

    [DPC-217] Update SANP version (#848)
    
    * [DPC-218] Update SACI version
    
    * Change the SACI name on the list
    
    * Create cold-kids-sleep.md
    
    * [DPC-217] Update SANP version
    
    * CHange SANP name
    
    * Create light-terms-sniff.md
    
    * Update .changeset/light-terms-sniff.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 0800051d28bc0112945d8bba1ca88d5d444d870d[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu May 9 17:01:38 2024 +0200

    [DPC-218] Update SACI version (#847)
    
    * [DPC-218] Update SACI version
    
    * Change the SACI name on the list
    
    * Create cold-kids-sleep.md
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit d16d58b6d2c4f3cb772fa0cafa617a671cc0273f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu May 9 14:54:00 2024 +0200

    [DEV-1624] Add app.gitbook.com domain to regular expression during parsing (#846)
    
    * Add app.gitbook.com domain to regular expression during GitBook docs parsing
    
    * Add more tests

[33mcommit e559eac04c91c9f0cb2b5c08ea30422baf47dcf3[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed May 8 16:49:45 2024 +0200

    [DEV-1252]: install storybook custom app (#719)
    
    * feat(DEV-1252): install storybook custom app
    
    * feat(DEV-1252): fix runtime error
    
    * feat(DEV-1252): add --no-open option to storybook script
    
    * feat(DEV-1252): move stories to storybook-app
    
    * feat(DEV-1252): move stories to storybook-app
    
    * feat(DEV-1252): update CODEOWNERS file
    
    * feat(DEV-1252): fix PR comments
    
    * feat(DEV-1252): fix package lock
    
    * feat(DEV-1252): fix tsconfig
    
    * feat(DEV-1252): remove first showcase on CtaCard story
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit da4003588ceacc89c1579399861796e7a37bee58[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue May 7 14:49:40 2024 +0200

    Hide PDND product (#844)

[33mcommit dde303353eb824a107cfe644abaed2161190b433[m
Author: christian-calabrese <christian.calabrese@pagopa.it>
Date:   Mon May 6 17:17:48 2024 +0200

    [DEV-1616] Created dynamodb table containing webinar subscriptions (#845)
    
    * feat: dynamodb containing webinar subscriptions created
    
    * created changeset for new dynamodb table

[33mcommit 08924f8f4b797211e03a194711926df369dbdc0f[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Fri May 3 10:47:52 2024 +0200

    [DEV-1405] Preserve scroll position of guide menu (#836)
    
    * guide menu preserve scroll pos
    
    * Create bright-balloons-sparkle.md
    
    * Update .changeset/bright-balloons-sparkle.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update .changeset/bright-balloons-sparkle.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit b515adaef7f6ea2534a1332cac4f4b6f8f498656[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu May 2 17:11:24 2024 +0200

    [DEV-1321] Increase the distance between the menu and title of guides and manuals (#840)
    
    * fix styles
    
    * Create itchy-seas-jam.md

[33mcommit e56b34279532e098a68400e48a59be44b0233706[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Apr 19 15:16:31 2024 +0200

    [DEV-1365] mermaid charts (#834)
    
    * mermaid charts
    
    * lock and changeset
    
    * dynamic
    
    * change id
    
    * Update apps/nextjs-website/src/components/atoms/MermaidDiagram/MermaidDiagram.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/components/atoms/MermaidDiagram/MermaidDiagram.tsx
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 593d521811a2f3deafa295e4cb65ddde9117355c[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Apr 19 14:38:33 2024 +0200

    [DPC-215] Change step 05 (#837)
    
    * [DPC-215] Change step 05
    
    * Create two-poems-cheat.md

[33mcommit 3bfcac460dd09f07008b6363d8909860920d19c2[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Apr 18 14:43:40 2024 +0200

    [DEV-1401] Use absolute urls for media saved on Strapi (#827)
    
    * create custom upload provider
    
    * add strapi-provider-upload-custom dependency
    
    * Create long-hairs-boil.md
    
    * split changeset
    
    * update CODEOWNERS
    
    * disable some lint rules
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit acca28ca747d71e7ca2cff3893697f3e6d71aa68[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Apr 18 12:38:32 2024 +0200

    [DEV-1603] Add PDND product (#833)
    
    * Add PDND product
    
    * Add changeset
    
    * Remove coming soon link from home page
    
    * Add PDND values to URL mapping between docs.pagopa.it and the developer portal
    
    * Fix tutorial link

[33mcommit ea1b31e66d5f4fa3debcaa36b25700af0757b369[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Apr 17 17:43:30 2024 +0200

    [DEV-1597]: Align webinars speakers' box (#831)
    
    * fix(DEV-1597): set width for webinars speakers' box
    
    * chore: add changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 5168bff8706197fc6b040442f69ec6313a40a9bd[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Apr 17 17:30:00 2024 +0200

    [DEV-1533] Redirect after successful login (#832)
    
    * encode redirect query string value
    
    * Create clever-toes-sip.md

[33mcommit d00e30072519513d5d42e712b26be421f6f2fa0a[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.6.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.20.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Apr 12 17:26:17 2024 +0200

    Update CHANGELOG and prepare next release (#825)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit a064905eadd04201609cf7558e54666846b8ba07[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Apr 12 17:16:45 2024 +0200

    [DEV-1595] sort webinars (#830)
    
    * sort webinars
    
    * Update .changeset/giant-buttons-develop.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * start date time
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 9c36bc123193e9afd4f6314a9162d84bab09b409[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Apr 11 16:51:03 2024 +0200

    Update codeowners file (#829)

[33mcommit 1e87eec7d8b147ded3d7fe90dea07e6a71fcea26[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Apr 11 16:42:17 2024 +0200

    Update codeowners file (#828)

[33mcommit 813dc3546625b4c5a796d64529e510a59abc13ba[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Apr 10 17:23:01 2024 +0200

    [DEV-1542]: fix images not visible on strapi preview (#826)
    
    * fix(DEV-1452): fix images not visible on strapi preview
    
    * chore: add changeset
    
    * fix(DEV-1542): remove duplicated variable
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 119f576911ee420bbd6bb36be85812ccbae07e66[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Apr 10 14:55:26 2024 +0200

    [DEV-1524]: render homepage webinars from Strapi (#793)
    
    * feat(DEV-1524): render webinars coming from strapi
    
    * feat(DEV-1524): render webinars coming from strapi
    
    * chore: add changeset
    
    * test(DEV-1524): fix tests
    
    * feat(DEV-1524): add StaticWebinar type
    
    * feat(DEV-1524): fix bug
    
    * feat(DEV-1524): fix bugs
    
    * fix(DEV-1524): rename fields
    
    * feat(DEV-1524): remove unused type
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit d5e894623c2a86e5f644a1acd6d0de034b858490[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Apr 10 12:25:36 2024 +0200

    [DEV-1564] Custom validator on webinars (#818)
    
    * Custom validator on webinars
    
    * pr comment
    
    * Update apps/strapi-cms/src/api/webinar/content-types/webinar/lifecycles.ts
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 0580401bc07807197dcdc02b39d0a21751c2ae00[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Apr 10 11:51:47 2024 +0200

    [DEV-1539] Align "Go to webinar" buttons (#820)
    
    * update styles
    
    * Create hungry-camels-pay.md
    
    * changes after review
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 31991a732da7c4ddf1a46a86648cfef76841fa12[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Apr 10 11:35:18 2024 +0200

    [DEV-1552]: update webinars homepage sections (#784)
    
    * feat(DEV-1552): update webinars home sections
    
    * chore: add changeset
    
    * feat(DEV-1552): fix bug
    
    * feat(DEV-1552): add tests and fix bugs
    
    * feat(DEV-1552): comment tests
    
    * feat(DEV-1552): skip tests
    
    * feat(DEV-1552): move helpers functions
    
    * feat(DEV-1552): refact components
    
    * feat(DEV-1552): refact components
    
    * Add the first webinar to the list of the past webinars in home page
    
    * Update apps/nextjs-website/src/components/organisms/FutureWebinarsShowcase/FutureWebinarsShowcase.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Remove new lines
    
    * feat(DEV-1552): use theme color
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * feat(DEV-1552): fix tests
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * test(DEV-1552): update sort clause
    
    * feat(DEV-1552): fix typo
    
    * feat(DEV-1552): hide future sections if no webinars
    
    * feat(DEV-1552): fix PR comments
    
    ---------
    
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 59c69edcc43cd3964a00ae69f4700c427a221ad7[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Tue Apr 9 12:51:43 2024 +0200

    [DEV-1566]: rename textContent field on website (#811)
    
    * feat(DEV-1566): rename textContent field
    
    * chore: add changeset
    
    * chore: remove code
    
    * chore: update changeset
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * [DEV-1586] Add GOOGLE_OAUTH_REDIRECT_URI env (#813)
    
    * [DEV-1517]: questions page reactiveness (#759)
    
    * feat(DEV-1517): more reactiveness on questions page
    
    * chore: add changeset
    
    * feat(DEV-1517): fix PR comments
    
    * feat(DEV-1517): increase refresh interval
    
    * fix(DEV-1517): fix PR comments
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update CODEOWNERS (#807)
    
    * [DPC-128] Add new tutorials for pagoPA (#809)
    
    * chore: update changeset
    
    * chore: remove unused files
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: Jeremy Gordillo <jere.gordi@gmail.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: Monica Costantini <122867940+certevol@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 04c921f6e1206994eadf9c04d05c566e421e59ad[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Tue Apr 9 12:35:10 2024 +0200

    [DEV-1566]: rename textContent field (#810)
    
    * feat(DEV-1566): rename textContent field
    
    * chore: add changeset
    
    * chore: update changeset
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * chore: update changeset
    
    ---------
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 1cf5c183cda31e15d675d6bd6644254f7f450a00[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Mon Apr 8 14:51:15 2024 +0200

    [DEV-1585] Update "Messaggi a contenuto remoto" webinar src (#822)
    
    * update webinar src
    
    * Create young-islands-refuse.md
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 2096fa2c88e7d24b01ae7073058cb19cf41a7981[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.5.7[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon Apr 8 14:11:12 2024 +0200

    Update CHANGELOG and prepare next release (#824)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit abb1bd69b9c77218fd518e46e48bdb52be1d1217[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Mon Apr 8 11:42:03 2024 +0200

    [DEV-1587] Add player.vimeo.com domain to CSP (#821)

[33mcommit d44449d6a25010f6943b829b8e225bade4c30617[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.19.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Apr 5 17:46:36 2024 +0200

    Update CHANGELOG and prepare next release (#823)

[33mcommit 54f276b39cb8af64d946e7c7f3726f1a254f2f8b[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Apr 5 17:42:57 2024 +0200

    [DPC-209] Add contents for next PagoPA Lab (#819)
    
    * [DPC-209] Add contents for next PagoPA Lab
    
    * [DPC-209] Add contents
    
    The images will be changed with the definitive ones. For now the team ask us to publish the page soon and therefore we have used placeholders.
    
    * DPC-209-Pagopa-Lab-TARI
    
    * [DPC-209] change in webinar showed in home page
    
    Only 2 webinars need to be shown on the home page, after this PR the last two are arriving and are:
    - Devtalk "pagoPA - GDP"
    - PagoPA Lab "TARI"

[33mcommit 6661cf5c95f9d2a7a162d32cfc449efa57588f23[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Apr 5 17:19:58 2024 +0200

    [DPC-198] Add new DevTalks pagoPA - GDP (#815)
    
    * [DPC-198] Add new DevTalks pagoPA - GDP
    
    * [DPC-198]add contents to detail page
    
    * DPC-198-new-devtalks
    
    * Add pagoPAGuideListsPath
    
    * Update apps/nextjs-website/src/_contents/webinars.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/_contents/webinars.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 6bb3757f9402deccf61ec6ecf0f0e26accd66566[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.5.1[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.18.0[m[33m, [m[1;33mtag: [m[1;33minfrastructure@0.5.6[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Apr 5 16:58:07 2024 +0200

    Update CHANGELOG and prepare next release (#816)

[33mcommit 91c56eaab21d419f0c4b856679266276126cb12c[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Apr 5 15:11:20 2024 +0200

    [DPC-204] Update Version for  "Manuale dei Servizi" app IO (#814)
    
    * [DPC-204] Update version for  "Manuale dei Servizi" app IO
    
    * Add the path 'https://docs.pagopa.it/i-modelli-dei-servizi' for correct parsing
    
    * DPC-204-Update-version
    
    * Update .changeset/famous-turtles-love.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 447999622e7cb08810852bfd2d303c03f46df4be[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Apr 5 14:58:36 2024 +0200

    [DPC-205] Add a new guide "Modelli dei Servizi" to app IO (#812)
    
    * [DPC-205] Adds a new guide "Modelli dei Servizi" to app IO
    
    * [DPC-205]
    
    Change the links on the overview page and add new guide in related link
    
    * DPC-205-modelli-servizi
    
    * Fix linting
    
    * Update .changeset/heavy-shirts-change.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 7d4b8006fb8bf519b0236118f06ef0bf0a4798aa[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Apr 5 13:52:13 2024 +0200

    [DPC-128] Add new tutorials for pagoPA (#809)

[33mcommit d7de017583ddf8d0d14d8c1b5062864a41ae672c[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Apr 4 17:15:35 2024 +0200

    Update CODEOWNERS (#807)

[33mcommit 5852a9a97453ffc54110d6b3de76e2b02f76cf5b[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Apr 4 17:09:32 2024 +0200

    [DEV-1517]: questions page reactiveness (#759)
    
    * feat(DEV-1517): more reactiveness on questions page
    
    * chore: add changeset
    
    * feat(DEV-1517): fix PR comments
    
    * feat(DEV-1517): increase refresh interval
    
    * fix(DEV-1517): fix PR comments
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit d8c8e9ed5ec3dbf6ff79c97675500516f8c27382[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Apr 4 16:45:48 2024 +0200

    [DEV-1586] Add GOOGLE_OAUTH_REDIRECT_URI env (#813)

[33mcommit f54c1418358056243755137e81df66254c502c00[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.5.5[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Thu Apr 4 12:56:53 2024 +0200

    Update CHANGELOG and prepare next release (#808)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 54224aefa9fc8f36a990304563e037cfdf3b4f31[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Apr 4 12:53:35 2024 +0200

    [DEV-1464] Ignore Task Definition changes (#806)

[33mcommit 9c447fd5406b394804f7883f5d2f02564bca31ce[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.17.0[m[33m, [m[1;33mtag: [m[1;33minfrastructure@0.5.4[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Apr 3 12:44:24 2024 +0200

    Update CHANGELOG and prepare next release (#805)

[33mcommit a7f9bc5945e537cc2d9a5e6e46d483c4ab91a1e9[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Apr 3 12:40:19 2024 +0200

    [DEV-1574] Increase `desired_count` of cms-ecs in production (#803)

[33mcommit 9aab50047942d420f30a9990d55af1b8521e08db[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Apr 3 10:02:37 2024 +0200

    [DPC-199] Add new latest version for SANP (#802)
    
    * [DPC-199] Add new latest version for SANP
    
    * [DPC-200] Change version number for SANP
    
    * Update SANP version
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit e496be4329699296adc8217547a3a7c25b34edc3[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Apr 3 09:51:53 2024 +0200

    [DEV-1577] Fix rendering of a single tab in a group of tabs (#804)
    
    * Fix rendering of a single tab in a group of tabs
    
    * Add changeset

[33mcommit 504daa819db1027b08519414d8754b037e8cccc4[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.16.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Tue Apr 2 10:16:19 2024 +0200

    Update CHANGELOG and prepare next release (#801)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit d72766250495cc8d0a7c2dbe0b047459e2f900d8[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Apr 2 10:12:47 2024 +0200

    Fix vimeo id for 'Esplorando App IO: I messaggi a contenuto remoto' webinar (#800)

[33mcommit 4936d46aee8acfe74cf9fde6a642e51afd9ea52a[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.5.3[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Mar 29 15:00:34 2024 +0100

    Update CHANGELOG and prepare next release (#799)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit aa4766a9e30faf4b58fd58087dcc462987d24e37[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Mar 29 14:57:00 2024 +0100

    [DEV-1562] Fix cms task definition template secret values (#798)

[33mcommit eeef591e3bcd367b74ed89a3c901797653fc13c4[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.5.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Mar 29 14:28:05 2024 +0100

    Update CHANGELOG and prepare next release (#797)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 93deedcbde1363d574aa635c15d1b53a40bf16db[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Mar 29 13:03:05 2024 +0100

    [DEV-1562] Move parameters to secrets section (#796)

[33mcommit 2a69b02589265aa825ce15a15632224d750ee9d5[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.5.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Mar 29 11:50:23 2024 +0100

    Update CHANGELOG and prepare next release (#795)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit df5ee9ea3d8533b809b8da6d2d8d30dcd1a54bfe[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Mar 29 11:47:11 2024 +0100

    [DEV-1562] Add cms_google_* parameters to ecs_task_execution (#794)

[33mcommit f7e715ab80697a6bebaa1260c9fd1e5149b50c11[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.5.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.16.0[m[33m, [m[1;33mtag: [m[1;33minfrastructure@0.5.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Mar 29 11:11:20 2024 +0100

    Update CHANGELOG and prepare next release (#787)

[33mcommit 2ba6415e2ea30271d4484c62954ac497e0744577[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Fri Mar 29 11:07:31 2024 +0100

    [DEV-1473] Add Google SSO (#786)

[33mcommit d966a41b58fdc34d678f4e63c9d612ba5c8c898f[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Mar 29 09:58:02 2024 +0100

    [DEV-1345] Link metric alarms to SNS topic (#789)

[33mcommit 4bb1086b0b3a9b0bc59b26f8eb1c3739487ca798[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Mar 29 09:47:06 2024 +0100

    [DEV-1524] webinars backend (#791)

[33mcommit fb3692bf45196adf6918c4b01d3dd24395090e0b[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Mar 28 18:16:10 2024 +0100

    [DEV-1521]: update webinars images (#790)
    
    * feat(DEV-1521): update webinars images
    
    * chore: add changeset
    
    * feat(DEV-1521): fix bug

[33mcommit ea340e943fb1848e4f5c615b1d3b918653441ae9[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Mar 28 17:22:03 2024 +0100

    [DEV-1499] Fetch webinars from strapi (#788)
    
    * feat(DEV-1546): render blocks content on the FE
    
    * chore: add changeset
    
    * feat(DEV-1546): add missing code
    
    * feat(DEV-1546): add subheadColor
    
    * feat(DEV-1546): add subheadColor
    
    * feat(DEV-1546): add missing subheadColor
    
    * Update apps/nextjs-website/src/components/molecules/BlocksRendererClient/BlocksRendererClient.tsx
    
    * Add webinar codec and move shared components
    
    * Add fetch from Strapi for webinars
    
    * Refactor contents following new updated types
    
    * Refactor component following new types
    
    * add changeset
    
    * Fix change set
    
    * Update apps/nextjs-website/src/lib/webinars.ts
    
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
    
    * Add TODO
    
    * Apply suggestions from code review
    
    Update image type and comments
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * Remove getWebinars function
    
    * Update apps/nextjs-website/src/lib/webinars.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Refactor textContent to bodyContent
    
    * remove unused translations
    
    * add EContainer to bodyContent
    
    * Fix webinar type
    
    * Fix block margin
    
    ---------
    
    Co-authored-by: Michele Da Rin Fioretto <michele.darinfioretto@uqido.com>
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 7f7ea277f3fbb21e20073185245a0ad84647e38e[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Mar 28 16:02:39 2024 +0100

    [DPC-187] Change in subtitle for webinar (#792)

[33mcommit b8429908150ae4ac5c6677bd71524410c06f6b52[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Mar 27 18:58:35 2024 +0100

    [DEV-1546]: render blocks content (#773)
    
    * feat(DEV-1546): render blocks content on the FE
    
    * chore: add changeset
    
    * feat(DEV-1546): add missing code
    
    * feat(DEV-1546): add subheadColor
    
    * feat(DEV-1546): add subheadColor
    
    * feat(DEV-1546): add missing subheadColor
    
    * Update apps/nextjs-website/src/components/molecules/BlocksRendererClient/BlocksRendererClient.tsx
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit c0c2a65695afb860d2059ea3c1c22f5cecc7684e[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Mar 27 18:29:28 2024 +0100

    [DEV-1434]: fetch blocks content from Strapi (#745)
    
    * feat(DEV-1433): display hero from Strapi
    
    * feat(DEV-1433): update test
    
    * chore: add changeset
    
    * feat(DEV-1433): update test
    
    * feat(DEV-1433): update code
    
    * feat(DEV-1433): update codecs names
    
    * feat(DEV-1433): fix codec bugs
    
    * feat(DEV-1433): add test
    
    * feat(DEV-1433): fix tests
    
    * chore: remove console.log
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * feat(DEV-1434): add BlocksRendererClient
    
    * feat(DEV-1434): update codecs
    
    * feat(DEV-1434): fix typo
    
    * chore: update changeset
    
    * test: update test
    
    * fix(DEV-1434): fix PR comments
    
    * fix(DEV-1434): fix PR comments
    
    * restored image
    
    * feat(DEV-1434): update test
    
    * feat(DEV-1434): fix codec's bugs
    
    * fix(DEV-1434): fix PR comments
    
    * feat(DEV-1434): remove FE changes
    
    * feat(DEV-1434): install missing dependency
    
    * feat(DEV-1434): update changeset
    
    * feat(DEV-1434): remove FE changes
    
    * feat(DEV-1434): remove FE changes
    
    * feat(DEV-1434): remove FE changes
    
    * feat(DEV-1434): update changeset
    
    * feat(DEV-1434): add subheadColor
    
    * Update apps/strapi-cms/src/components/common/hero-slide.json
    
    * Update apps/strapi-cms/src/components/common/hero-slide.json
    
    ---------
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit d7f6eeef81497265f4c4f8192ebbcb18f1126875[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.4.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.15.3[m[33m, [m[1;33mtag: [m[1;33minfrastructure@0.4.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Mar 27 17:22:06 2024 +0100

    Update CHANGELOG and prepare next release (#785)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 726ff180e33bae08a4a6ca6194e4eb442e474c8d[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Mar 27 17:16:22 2024 +0100

    [DEV-1345] Create SNS topic and subscriptions for metric alarms (#783)

[33mcommit 1ed75ad8db719b619585c2046610f102bd3fe7c9[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Mar 27 16:43:20 2024 +0100

    [DEV-1536] Strapi setup for webinars and webinar speakers (#780)

[33mcommit 9bd7fae9fdb13db549e5b9cb4348eb4eaf005eb8[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Mar 27 15:24:37 2024 +0100

    [DEV-1506] Signup form tests (#725)
    
    * add hook
    
    * add Policy component
    
    * refactor signup form
    
    * add @testing-library/jest-dom
    
    * update jest config
    
    * add tests
    
    * Create large-planes-act.md
    
    * Create empty-jobs-speak.md
    
    * refactor
    
    * remove ghost file
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>

[33mcommit 83fd73c5a79ce982242b35d0dafac64785ad6139[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Mar 27 11:42:23 2024 +0100

    [DEV-1469] Reset signup form errors on user changes (#724)
    
    * add hook
    
    * add Policy component
    
    * refactor signup form
    
    * Create large-planes-act.md
    
    * changes after review
    
    * fix checkbox value
    
    * improve types
    
    * improve code
    
    * Update .changeset/large-planes-act.md
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    
    * changes after review
    
    * Update apps/nextjs-website/src/components/organisms/Auth/PasswordTextField.tsx
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    
    * fix suggestion
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 83f965281c851b33f7392b61a7836bd08d8b01c1[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Mar 27 11:02:41 2024 +0100

    [DEV-1513]  Change password form errors on user changes (#750)
    
    * reset errors after input change
    
    * Create violet-dryers-dress.md
    
    * changes after review
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 61648ac45583f7a4e9cd508bd4208c673a47e9a5[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Mar 27 10:19:26 2024 +0100

    [DEV-1495] Reset change password form errors on user changes (#736)
    
    * refactor ChangePasswordForm
    
    * reset errors on input change
    
    * Create hot-pigs-allow.md
    
    * fix error text visibility
    
    * changes after review

[33mcommit b79c16f50b841e40da9317156733abdf4556e2bc[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.15.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Tue Mar 26 17:02:24 2024 +0100

    Update CHANGELOG and prepare next release (#779)

[33mcommit 427973261b04063234afb2d8706ce1a93660ebc8[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Mar 26 15:18:08 2024 +0100

    Fix cover image of the webinar "Esplorando App IO: I messaggi a contenuto remoto" (#782)

[33mcommit 6bb0719193ebdc525d65c37ed2f0e3c20ab54501[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Mar 26 14:51:37 2024 +0100

    Set endDateTime of 'always-live' webinar to year 2077 (#781)

[33mcommit 33ed5cd34a1cc0571df043964037537189ee1956[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Tue Mar 26 10:01:13 2024 +0100

    [DEV-1516]: submit keys question form (#756)
    
    * feat(DEV-1516): handle submit with keys
    
    * feat(DEV-1516): handle submit with keys
    
    * chore: add changeset
    
    * chore: update changeset
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * feat(DEV-1516): update keys combination
    
    * feat(DEV-1516): add comment
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit fc8c8387faaebf47357418b2f11cae007a1ed7ee[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Tue Mar 26 09:47:13 2024 +0100

    [DEV-1466] Reset MFA form errors on user changes (#694)
    
    * refactor confirm login
    
    * add tests
    
    * Create wet-squids-raise.md
    
    * relocate test file
    
    * changes after review
    
    * Update .changeset/wet-squids-raise.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * disable submit btn after first submit
    
    * refactor tests
    
    * changes after review
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit ac37afa4b35fe2bceeffa7709a5932c830152d7b[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.15.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Tue Mar 26 09:06:59 2024 +0100

    Update CHANGELOG and prepare next release (#778)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 7229d3cbe4e9c8c39799156fe86acb7445728df8[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon Mar 25 18:34:03 2024 +0100

    [DPC-188] Resize webinar images (#777)
    
    * [DPC-188] Resize webinar images
    
    * Change image in detail page for webinar
    
    * resize webinar image
    
    * change reference image
    
    * Fix resize image
    
    * Update apps/nextjs-website/src/_contents/webinars.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 9281a061c00ad2029f7e0db522a6619c96483145[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.15.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon Mar 25 16:07:37 2024 +0100

    Update CHANGELOG and prepare next release (#772)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit df04081a684f222611350a8aa4d34ca99139ea5c[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon Mar 25 15:57:37 2024 +0100

    [DPC-188] Add DevTalk IO-Remote-Content (#776)
    
    * [DPC-188] Add images for DevTalk IO-Remote-Content
    
    * Add webinar details for DevTalk-IO-Remote-Content
    
    * Add changeset
    
    * Update apps/nextjs-website/src/_contents/webinars.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 88c38bd5d4ebf8ada4bd37c35c5e53d2965bf023[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Mon Mar 25 13:57:31 2024 +0100

    [DEV-1502] Add metadata to webinar page (#738)

[33mcommit 97d1679cf18877da55fe0e425b238b067605199b[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Mar 22 10:28:55 2024 +0100

    [DEV-1545] Add custom PathReporter (#770)

[33mcommit c52e36e746383232b9f502e59a0a710c24dfcb07[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.3.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Thu Mar 21 17:04:22 2024 +0100

    Update CHANGELOG and prepare next release (#771)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 0ba22dd0d9c3384ada98859fd448128be384a747[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 21 17:00:07 2024 +0100

    [DEV-1543] Allow fetching images from devportal domains (#769)

[33mcommit 260406adb765ff32f770aa04ee30ddd34ee60ddd[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.3.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Thu Mar 21 09:43:37 2024 +0100

    Update CHANGELOG and prepare next release (#768)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit ecf2fc457c4f31b2c0959b4a666daa0d6812586a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 21 09:40:13 2024 +0100

    [DEV-1472] Update CDN url in task definition (#767)

[33mcommit 6be650829501f5209dbb318f1df1556a86106053[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 21 09:32:33 2024 +0100

    [DEV-1538] Reach Media Library CDN using custom domain (#766)

[33mcommit 5d2e69c39477c4e7704af98ff312c9a2376b9ee0[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.14.3[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Mar 20 14:56:52 2024 +0100

    Update CHANGELOG and prepare next release (#765)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit b699ba0aeb674dea2f358815127a458b2093b36f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Mar 20 14:52:16 2024 +0100

    Revert "[DPC-194] Update video on demand src" (#764)
    
    * Revert "[DPC-194] Update video on demand src (#761)"
    
    This reverts commit 6b2075e30edf082872cd10ef9497459197a131e6.
    
    * Create shiny-comics-allow.md

[33mcommit c6e4315924e26a7e707630ec70a16295621c1bbf[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.14.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Mar 20 13:13:46 2024 +0100

    Update CHANGELOG and prepare next release (#762)

[33mcommit 6b2075e30edf082872cd10ef9497459197a131e6[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Mar 20 13:06:45 2024 +0100

    [DPC-194] Update video on demand src (#761)
    
    * [DPC-194] Update video on demand src
    
    * Create thin-games-promise.md

[33mcommit da71f745d31590e8e6a76d4c2caf66302bbfc377[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.3.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Tue Mar 19 19:28:40 2024 +0100

    Update CHANGELOG and prepare next release (#760)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit b4f0221f577843d6e37a52dc02d5c788f193187f[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Mar 19 19:23:28 2024 +0100

    [DEV-1529] Create DNS for the CMS Media Library (#751)

[33mcommit 7d21f198abe47d542bf61b181330318897707248[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.14.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Tue Mar 19 13:43:31 2024 +0100

    Update CHANGELOG and prepare next release (#758)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 3effab568701477a9f905cc8e3d323a8bd1eba2a[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Mar 19 12:48:48 2024 +0100

    [DEV-1534] Update webinar timing (#757)
    
    * [DEV-1534] Update webinar timing
    
    * Create popular-readers-crash.md
    
    ---------
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit ebc7c275bce7fecdbc54f6e9b15aae622b6478ec[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.2.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon Mar 18 16:03:55 2024 +0100

    Update CHANGELOG and prepare next release (#755)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 60e0be7b14303a424145e0ee01b0b5fa14822c34[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Mar 18 15:58:42 2024 +0100

    [DEV-1489] Add Active Campaign records (#752)

[33mcommit 4cfeb09874847eb136b11771066b34eea7a01609[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.1.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon Mar 18 15:38:03 2024 +0100

    Update CHANGELOG and prepare next release (#754)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit fd08262ecf750263b6404271e740e8993e0242db[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Mar 18 15:33:58 2024 +0100

    [DEV-1525] Add auto_minor_version_upgrade with true value (#753)

[33mcommit 89326992de56b99a9d805efc25c25eccde4008a2[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.14.0[m[33m, [m[1;33mtag: [m[1;33mgitbook-docs@0.1.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Mar 15 14:43:38 2024 +0100

    Update CHANGELOG and prepare next release (#748)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 24e856a37dffa5add3eee438e8f44984c39ef67f[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Mar 15 10:34:11 2024 +0100

    [DEV-1347]: change subscribe button click logic (#708)
    
    * feat(DEV-1437): change subscribe button click logic
    
    * chore: add changeset
    
    * feat(DEV-1437): use router.push instead of router.replace
    
    * feat(DEV-1347): refact code to subscribe after user login
    
    * chore: update changeset
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * feat(DEV-1347): refact code to subscribe after user login
    
    * [DEV-1433]: display hero from Strapi (#672)
    
    * feat(DEV-1433): display hero from Strapi
    
    * feat(DEV-1433): update test
    
    * chore: add changeset
    
    * feat(DEV-1433): update test
    
    * feat(DEV-1433): update code
    
    * feat(DEV-1433): update codecs names
    
    * feat(DEV-1433): fix codec bugs
    
    * feat(DEV-1433): add test
    
    * feat(DEV-1433): fix tests
    
    * chore: remove console.log
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * feat(DEV-1433): simplify logic
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * [DEV-1342] Remove email in url (#663)
    
    * Remove email in url
    
    * eslint
    
    * changeset
    
    * pr comment
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Do not fetch from cache when executing deploy website workflow (#699)
    
    * Update CHANGELOG and prepare next release (#682)
    
    * Fix pagoPA guides and manuals version (#700)
    
    * Revert "Fix pagoPA guides and manuals version (#700)" (#701)
    
    This reverts commit 17ef17975e1719b6be8d36a3b74e02c7ac3b229a.
    
    * [DPC-160] Fix pagoPA guides and manuals version (#702)
    
    * Update CHANGELOG and prepare next release (#703)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>
    
    * chore: fix typo
    
    * Add NullToUndefined custom type
    
    * feat(DEV-1433): simplify logic
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * feat(DEV-1433): add explanatory comment
    
    ---------
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    
    * [DEV-1427] Move infrastructure under the monorepo structure (#720)
    
    * [DEV-1465] Reset login form errors on user changes (#692)
    
    * refactor login form
    
    * handle reset errors on change input value
    
    * add LoginForm tests
    
    * add test
    
    * Create sour-penguins-smile.md
    
    * Moved test file
    
    * fix error prop value
    
    * improve test
    
    * pr changes
    
    * minor fixes
    
    * changes after review
    
    * Update .changeset/sour-penguins-smile.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * [DPC-175] Removes ref. to specific versions in the guide list and redirects to the latest pagoPA (#726)
    
    * [DPC-175] Removes all ref to specific versions in the guide list and redirects to the latest for pagoPA
    
    * [DPC-175] Latest version in "pagoPA Panoramica"
    
    * [DPC-175] Latest version in "pagoPA Quick Start"
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * [DPC-171] Removes ref. to specific version and redirects to lates in Quick Start  Firma con IO (#727)
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * [DEV-1503] Add googleusercontent to trusted domains (#722)
    
    * Revert "[DPC-171] Removes ref. to specific version and redirects to lates in …" (#732)
    
    * Revert "[DPC-175] Removes ref. to specific versions in the guide list and red…" (#731)
    
    This reverts commit abdb055aa9bcace85f1daca963546f7d2818fcad.
    
    * [DPC-169] Removes version and redirects to latest in Panoramica App IO (#730)
    
    * [DPC-169] Removes version and redirects to latest in Panoramica App IO
    
    * [DPC-169]Removes version and redirects to latest in Webinar Description
    
    * Add changeset
    
    * [DPC-175] Removes ref. to specific versions in the guide list and redirects to the latest pagoPA  (#733)
    
    * [DPC-175] Removes all ref to specific versions in the guide list and redirects to the latest for pagoPA
    
    * [DPC-175] Latest version in "pagoPA Panoramica"
    
    * [DPC-175] Latest version in "pagoPA Quick Start"
    
    ---------
    
    Co-authored-by: Monica Costantini <122867940+certevol@users.noreply.github.com>
    
    * [DPC-171] Removes specific version and redirects to lates in Quick Start Firma con IO (#734)
    
    * [DPC-171] Removes ref. to specific version and redirects to lates in Quick Start  Firma con IO
    
    * [DPC-175] Removes ref. to specific versions in the guide list and redirects to the latest pagoPA (#726)
    
    * [DPC-175] Removes all ref to specific versions in the guide list and redirects to the latest for pagoPA
    
    * [DPC-175] Latest version in "pagoPA Panoramica"
    
    * [DPC-175] Latest version in "pagoPA Quick Start"
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Monica Costantini <122867940+certevol@users.noreply.github.com>
    
    * [DPC-170] Redirects to "Validatore" SEND latest version in HomePage (#728)
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * [DEV-1315]: highlight and hide webinars questions (#646)
    
    * feat(DEV-1315): highlight and hide webinars questions
    
    * feat(DEV-1315): add UpdateItem to host user
    
    * chore: fix typo
    
    * feat(DEV-1315): remove definitions from terraform
    
    * chore: add changeset
    
    * feat(DEV-1358): remove unused code
    
    * feat(DEV-1315): update webinars questions' row
    
    * feat(DEV-1315): update style
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * feat(DEV-1315): update style
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * feat(DEV-1315): update style
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * chore: update changeset
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * feat(DEV-1315): add user names
    
    * chore: remove unused code
    
    * feat(DEV-1315): update tests
    
    * feat(DEV-1315): update code
    
    * chore: remove unused code
    
    * test: update tests
    
    * feat(DEV-1315): update logic
    
    * feat(DEV-1315): add default tcColor
    
    * feat(DEV-1315): update IconButton visibility icon
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * feat(DEV-1315): update WebinarQuestion codec to accept undefined values
    
    * chore: remove test webinar
    
    * feat(DEV-1315): unify update question logic
    
    * chore: remove test webinar
    
    * Webinar questions review (#704)
    
    * feat(DEV-1315): update translation
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * [DEV-1448] Add concurrency in workflows that are using terraform (#735)
    
    * [DEV-1448] Add concurrency group in deploy workflows (#737)
    
    * [DPC-168]  Adds cover images for new BO manual for pagoPA (#739)
    
    * [DEV-1505] Webinar tests (#729)
    
    * Update CHANGELOG and prepare next release (#718)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>
    
    * Move working-directory to a single step (#740)
    
    * Add changeset (#741)
    
    * Update CHANGELOG and prepare next release (#742)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>
    
    * feat(DEV-1347): redirect also the authenticated users
    
    * feat(DEV-1347): update useEffect deps
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: Jeremy Gordillo <jere.gordi@gmail.com>
    Co-authored-by: Monica Costantini <122867940+certevol@users.noreply.github.com>

[33mcommit 9bddc42388d3c4126b7fb7aa69f2a266eb0a697c[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Mar 14 17:21:14 2024 +0100

    [DEV-1515] Fix webinar form and webinar questions page (#747)
    
    * Fix webinar form and webinar questions page
    
    * Fixes after code review
    
    * Fixes after code review
    
    * Fixes after functional review
    
    * Fixes after code review
    
    * Simplify filter

[33mcommit 5739492cf22c70994b2cb29c60670e108cb1f314[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Thu Mar 14 16:31:12 2024 +0100

    [DEV-1041] Swagger Parser (#650)

[33mcommit 93327c857cde4bf4622747ff329c90a82cb746b6[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Mar 14 14:21:01 2024 +0100

    [DEV-1478] Adds new Speaker at PagoPA LAB Webinar (#744)

[33mcommit b05bcc7e9d69fd5c1c4f5dec3aa5608dbf54817a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 14 10:53:29 2024 +0100

    Add condition on job check_pr_title (#746)
    
    Now the job is skipped on PRs created by changeset

[33mcommit 3fb9f41cf37d2602fbe0163c6e1bb5e4ab6e1bd3[m[33m ([m[1;33mtag: [m[1;33minfrastructure@0.1.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Mar 13 12:14:26 2024 +0100

    Update CHANGELOG and prepare next release (#742)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 47427425d066c0817a133037e2b4a6cb11db82cd[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Mar 13 12:10:49 2024 +0100

    Add changeset (#741)

[33mcommit ac58f73a51197068890239c08036ebb9e06bb051[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Mar 13 12:01:55 2024 +0100

    Move working-directory to a single step (#740)

[33mcommit c4c5f83cb641cf94c1bd7456c29ca7a9128f1ac6[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.13.0[m[33m, [m[1;33mtag: [m[1;33minfrastructure@0.1.0[m[33m, [m[1;33mtag: [m[1;33mgitbook-docs@0.0.3[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Mar 13 11:44:44 2024 +0100

    Update CHANGELOG and prepare next release (#718)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 3c9fbe86a39ae7335a054074d4214fe1730c0e70[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Mar 13 11:38:26 2024 +0100

    [DEV-1505] Webinar tests (#729)

[33mcommit 67c66bf9480c653030a3bf80bdc1bfff3578ca43[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Mar 13 11:31:32 2024 +0100

    [DPC-168]  Adds cover images for new BO manual for pagoPA (#739)

[33mcommit 70b06587f99ffc276fbb2af780ae446588801350[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Mar 13 10:39:54 2024 +0100

    [DEV-1448] Add concurrency group in deploy workflows (#737)

[33mcommit bb5dff4e3295be889b4af19ff6008994af9c5f91[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Mar 12 16:35:30 2024 +0100

    [DEV-1448] Add concurrency in workflows that are using terraform (#735)

[33mcommit 458c58fdf883187b863ca75e6fe6b87626774a67[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Tue Mar 12 12:17:06 2024 +0100

    [DEV-1315]: highlight and hide webinars questions (#646)
    
    * feat(DEV-1315): highlight and hide webinars questions
    
    * feat(DEV-1315): add UpdateItem to host user
    
    * chore: fix typo
    
    * feat(DEV-1315): remove definitions from terraform
    
    * chore: add changeset
    
    * feat(DEV-1358): remove unused code
    
    * feat(DEV-1315): update webinars questions' row
    
    * feat(DEV-1315): update style
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * feat(DEV-1315): update style
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * feat(DEV-1315): update style
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * chore: update changeset
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * feat(DEV-1315): add user names
    
    * chore: remove unused code
    
    * feat(DEV-1315): update tests
    
    * feat(DEV-1315): update code
    
    * chore: remove unused code
    
    * test: update tests
    
    * feat(DEV-1315): update logic
    
    * feat(DEV-1315): add default tcColor
    
    * feat(DEV-1315): update IconButton visibility icon
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * feat(DEV-1315): update WebinarQuestion codec to accept undefined values
    
    * chore: remove test webinar
    
    * feat(DEV-1315): unify update question logic
    
    * chore: remove test webinar
    
    * Webinar questions review (#704)
    
    * feat(DEV-1315): update translation
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit b7ed47f377712ad9f6e57528e04be15a10da809c[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Mar 12 11:34:30 2024 +0100

    [DPC-169] Removes version and redirects to latest in Panoramica App IO (#730)
    
    * [DPC-169] Removes version and redirects to latest in Panoramica App IO
    
    * [DPC-169]Removes version and redirects to latest in Webinar Description
    
    * Add changeset
    
    * [DPC-175] Removes ref. to specific versions in the guide list and redirects to the latest pagoPA  (#733)
    
    * [DPC-175] Removes all ref to specific versions in the guide list and redirects to the latest for pagoPA
    
    * [DPC-175] Latest version in "pagoPA Panoramica"
    
    * [DPC-175] Latest version in "pagoPA Quick Start"
    
    ---------
    
    Co-authored-by: Monica Costantini <122867940+certevol@users.noreply.github.com>
    
    * [DPC-171] Removes specific version and redirects to lates in Quick Start Firma con IO (#734)
    
    * [DPC-171] Removes ref. to specific version and redirects to lates in Quick Start  Firma con IO
    
    * [DPC-175] Removes ref. to specific versions in the guide list and redirects to the latest pagoPA (#726)
    
    * [DPC-175] Removes all ref to specific versions in the guide list and redirects to the latest for pagoPA
    
    * [DPC-175] Latest version in "pagoPA Panoramica"
    
    * [DPC-175] Latest version in "pagoPA Quick Start"
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Monica Costantini <122867940+certevol@users.noreply.github.com>
    
    * [DPC-170] Redirects to "Validatore" SEND latest version in HomePage (#728)
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 92dd50b1e8a1dcaf1fe2396ee07e0b2c56f9e2fc[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Mar 12 10:45:23 2024 +0100

    Revert "[DPC-175] Removes ref. to specific versions in the guide list and red…" (#731)
    
    This reverts commit abdb055aa9bcace85f1daca963546f7d2818fcad.

[33mcommit 86f0cc01e9c8f0dc577871d9014643153cfb738c[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Mar 12 10:45:05 2024 +0100

    Revert "[DPC-171] Removes ref. to specific version and redirects to lates in …" (#732)

[33mcommit e1c37960b5000847c5381bcd98fd479876f8d390[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Mar 12 10:37:00 2024 +0100

    [DEV-1503] Add googleusercontent to trusted domains (#722)

[33mcommit 76baf3b94ccadd7dab3435e1b79301748250109b[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Mar 12 10:04:43 2024 +0100

    [DPC-171] Removes ref. to specific version and redirects to lates in Quick Start  Firma con IO (#727)
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit abdb055aa9bcace85f1daca963546f7d2818fcad[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Mar 12 09:51:20 2024 +0100

    [DPC-175] Removes ref. to specific versions in the guide list and redirects to the latest pagoPA (#726)
    
    * [DPC-175] Removes all ref to specific versions in the guide list and redirects to the latest for pagoPA
    
    * [DPC-175] Latest version in "pagoPA Panoramica"
    
    * [DPC-175] Latest version in "pagoPA Quick Start"
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit ffde2ad97166e6045a1b84ca8176a27870de1f7c[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Mon Mar 11 16:36:31 2024 +0100

    [DEV-1465] Reset login form errors on user changes (#692)
    
    * refactor login form
    
    * handle reset errors on change input value
    
    * add LoginForm tests
    
    * add test
    
    * Create sour-penguins-smile.md
    
    * Moved test file
    
    * fix error prop value
    
    * improve test
    
    * pr changes
    
    * minor fixes
    
    * changes after review
    
    * Update .changeset/sour-penguins-smile.md
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit f250a26f49b8bc3a97044582ff0ef10270401bc5[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Mar 11 16:04:27 2024 +0100

    [DEV-1427] Move infrastructure under the monorepo structure (#720)

[33mcommit 1730ae31364bd5c7c1bef46f42e274d9223078fd[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Mon Mar 11 15:40:17 2024 +0100

    [DEV-1433]: display hero from Strapi (#672)
    
    * feat(DEV-1433): display hero from Strapi
    
    * feat(DEV-1433): update test
    
    * chore: add changeset
    
    * feat(DEV-1433): update test
    
    * feat(DEV-1433): update code
    
    * feat(DEV-1433): update codecs names
    
    * feat(DEV-1433): fix codec bugs
    
    * feat(DEV-1433): add test
    
    * feat(DEV-1433): fix tests
    
    * chore: remove console.log
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * feat(DEV-1433): simplify logic
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * [DEV-1342] Remove email in url (#663)
    
    * Remove email in url
    
    * eslint
    
    * changeset
    
    * pr comment
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Do not fetch from cache when executing deploy website workflow (#699)
    
    * Update CHANGELOG and prepare next release (#682)
    
    * Fix pagoPA guides and manuals version (#700)
    
    * Revert "Fix pagoPA guides and manuals version (#700)" (#701)
    
    This reverts commit 17ef17975e1719b6be8d36a3b74e02c7ac3b229a.
    
    * [DPC-160] Fix pagoPA guides and manuals version (#702)
    
    * Update CHANGELOG and prepare next release (#703)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>
    
    * chore: fix typo
    
    * Add NullToUndefined custom type
    
    * feat(DEV-1433): simplify logic
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * feat(DEV-1433): add explanatory comment
    
    ---------
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>

[33mcommit 6d8f876d715ad6863272e763262c3bdfc4c4be23[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Mar 8 18:40:43 2024 +0100

    [DEV-1497] Fix homepage webinar banner visibility (#716)
    
    * fix banner visibility
    
    * linte
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 0db977bfafe2c0ce6ee95ae8ca649eb8e52fe27d[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Mar 8 18:11:39 2024 +0100

    [DEV-1388] Fix list items font size (#712)
    
    * fix list items style
    
    * changeset, linting
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 3bd56612d246f353ffb3bfb8c4dfb757f597e385[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Mar 8 17:40:38 2024 +0100

    [DEV-1393] Handle data-size image attribute to support inline image rendering (#705)
    
    * partial solution
    
    * Handle data-size image attribute to support inline image rendering
    
    * test
    
    * Update packages/gitbook-docs/src/__tests__/parseContent.test.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Update packages/gitbook-docs/src/__tests__/parseContent.test.ts
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit de9bbbe58f33966a6c5d8fc47cf713ecd186964f[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Mar 8 17:10:06 2024 +0100

    [DEV-1481]: webinar link visibility (#707)
    
    * feat(DEV-1481): make webinar link visibile on prod env
    
    * chore: add changeset
    
    * chore: make change minor
    
    * chore: update changeset
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 7816dc8d092580194eb40909d8990560da449312[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.12.3[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Mar 8 14:48:27 2024 +0100

    Update CHANGELOG and prepare next release (#715)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 9886edfcb0ffed69fbbf7a6caf0fd77950b5536a[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Mar 8 13:09:41 2024 +0100

    Replace images of pagopa-lab webinar (#714)

[33mcommit afdfe1c488d796c32c10c3f5808c66d7eae52859[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.12.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Thu Mar 7 18:18:11 2024 +0100

    Update CHANGELOG and prepare next release (#713)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 89d164a66cf04b7835dab639f1442662b372dd2d[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Mar 7 17:59:05 2024 +0100

    [DEV-1478] Add content for PagoPA LAB first Webinar (#710)
    
    * [DEV-1478] Add content for PagoPA LAB first Webinar
    
    * Create thin-doors-tease.md
    
    * [DEV-1478] remove past webinars from the homepage
    
    * [dev-1478] Change in webinar duration
    
    * [DEV-1476] Change Surname for Speaker
    
    * Add speakers images
    
    * Fix speaker name
    
    ---------
    
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>

[33mcommit 76ccd84fbf579e6c245130564d6c35627f41d2c1[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.12.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Mar 1 17:13:59 2024 +0100

    Update CHANGELOG and prepare next release (#703)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 644762071f594c233615a345e2aad2dd9f53c91c[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Mar 1 17:09:10 2024 +0100

    [DPC-160] Fix pagoPA guides and manuals version (#702)

[33mcommit e6ff7eb983bb7e0cab14afb98ce50a7ed1b1c64c[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Mar 1 17:06:08 2024 +0100

    Revert "Fix pagoPA guides and manuals version (#700)" (#701)
    
    This reverts commit 17ef17975e1719b6be8d36a3b74e02c7ac3b229a.

[33mcommit 17ef17975e1719b6be8d36a3b74e02c7ac3b229a[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Mar 1 17:00:38 2024 +0100

    Fix pagoPA guides and manuals version (#700)

[33mcommit d829f52168372f79b93684ef4ec4a1ec6ab67d57[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.3.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.12.0[m[33m, [m[1;33mtag: [m[1;33mgitbook-docs@0.0.2[m[33m, [m[1;33mtag: [m[1;33mcloudfront-functions@0.0.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Mar 1 14:18:04 2024 +0100

    Update CHANGELOG and prepare next release (#682)

[33mcommit 2c57bf3210dc1b6a76f5832bce8d37aa8a07b717[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Mar 1 12:53:24 2024 +0100

    Do not fetch from cache when executing deploy website workflow (#699)

[33mcommit 8144e56f57f92cad5305ad99bb89f989e50f4dbc[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Mar 1 12:42:30 2024 +0100

    [DEV-1342] Remove email in url (#663)
    
    * Remove email in url
    
    * eslint
    
    * changeset
    
    * pr comment
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 98530ba81f27ec380373e2b351cd70070af13f54[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Mar 1 11:22:12 2024 +0100

    [DEV-1471] Fix product's description type (#698)
    
    * Fix product's description type
    
    * Add changeset

[33mcommit cc14556cdf52e19a9912c4b6e5c9152a36690ee7[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Mar 1 10:37:24 2024 +0100

    Add repository dispatch trigger (#697)

[33mcommit 7ef59764a3f520d7809e4e5675f291e5d923e967[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Feb 29 18:28:44 2024 +0100

    Update Dockerfile of strapi (#696)

[33mcommit af338efbfaec5d23316de5c115e907fa1dce5c07[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Feb 29 17:30:33 2024 +0100

    Update deploy cms workflow (#695)

[33mcommit bc76e76b4e49d02a2047316e2f36b46d447a43aa[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Feb 29 17:20:55 2024 +0100

    [DPC-160] Change name 3.20 --> 3.2.1 (#662)

[33mcommit fcf39733820fc6fc297cb9ee8e89fb6f36553112[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Feb 29 17:09:52 2024 +0100

    [DPC-166] Changed main version (#664)

[33mcommit bef5797622245d9ac469ffea4a803da3d507fdb7[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 29 16:53:41 2024 +0100

    Few fixes on Terraform files (#693)

[33mcommit ce00c1e7c851f035ff279986259115f777d0176e[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Feb 29 16:52:09 2024 +0100

    [DEV-1274] Add Update Static Content plugin to Strapi to trigger static site deployment (#686)

[33mcommit c981c405852e98cbc97f518179811cf81918a5aa[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Feb 29 16:27:09 2024 +0100

    [DEV-1463] Add Strapi configuration to accept PostgreSQL connections (#691)

[33mcommit 90ea20186001b92a87ae56166769b8849ca82ea6[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Thu Feb 29 16:06:05 2024 +0100

    [DEV-1462] - Terraform create log group for CMS (#689)

[33mcommit d3c4744b70117a85b570e2af2a0a67420f5de281[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 29 11:21:40 2024 +0100

    [DEV-1422] Refactor on Cognito resources (#690)

[33mcommit 962b3df8a3bd26597de40d37d3e2d12bbd280d61[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 29 11:11:10 2024 +0100

    [DEV-1424] Organize Terraform files (#684)

[33mcommit e435919b01166e84dd2715f30e7049c5395f9db9[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Feb 29 09:44:11 2024 +0100

    [DEV-1432]: Add heroSlider to the homepage schema, CallToAction component and HeroSlide component to Strapi (#671)
    
    * feat(DEV-1432): add hero schema on strapi
    
    * chore: update changeset
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * chore: update changeset message
    
    * feat(DEV-1432): update strapi schema
    
    * revert package-lock.json
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Michele Da Rin Fioretto <michidarin@gmail.com>

[33mcommit 92176156d2ae9bddd043041e85c8e7c2481a39d6[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Wed Feb 28 17:28:58 2024 +0100

    setup-active-1-node-of-ecs (#688)

[33mcommit 5b5eb3fb24f6e9aa5fb25f6fd81ddcdf909bdcea[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Feb 28 17:23:51 2024 +0100

    Remove extends within Strapi tsconfig.json files (#687)

[33mcommit 9cbc4185491e95bd28cd2d726ad96644f998bbed[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Feb 28 16:12:07 2024 +0100

    [DEV-1418] Allow fetching from the CMS the "In evidenza" section on the home page (#667)
    
    * Allow fetching from the CMS the "In evidenza" section on the home page
    
    * Add changeset
    
    * Fix homepage test
    
    * Fix type to prevent error when newsShowcase is null
    
    * Fixes after code review
    
    * Set newsItem image as optional
    
    * Fix publishedAt type in NewsItemCodec
    
    ---------
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>

[33mcommit b2dedb0a54bd469ebb8271522142468e722c4f5f[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Feb 28 13:08:48 2024 +0100

    [DEV-1374] Correct br parsing (#676)

[33mcommit fe20b974857a85090d93f08944037f8a3a196dd4[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Wed Feb 28 10:38:28 2024 +0100

    [DEV-960] Add workflow deploy cms and dockerfile (#644)

[33mcommit b9e82d4625582af4ad17377b47fba4ad1994bbec[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Feb 27 17:40:06 2024 +0100

    [DEV-1417] Add news-item entity and news-showcase component to Strapi CMS (#666)

[33mcommit 2f766783302bc2531131c63b63b688442f698940[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Tue Feb 27 16:57:42 2024 +0100

    [DEV-1406] Handle the trailing slash of the URL (#685)

[33mcommit f564577b26c8fe68e793f2b6ae1987aa3143c1a3[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Tue Feb 27 16:45:16 2024 +0100

    [DEV-1369] Anchor Links with hash (#670)

[33mcommit f5a3f491bf140ed834521324c882a2156239d9b3[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Tue Feb 27 12:49:06 2024 +0100

    [DEV-1356] - Add dns record for CMS Strapi (#638)

[33mcommit 123bd79f85f5fe42cfe9eb461bdda2ad15b55375[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 27 12:24:27 2024 +0100

    [DEV-1383, DEV-1384] Create ECS and ALB for CMS Strapi (#678)

[33mcommit 81392a4ebe7297c40505f6c337d34eb024a55f96[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 27 12:07:56 2024 +0100

    Add domain validation options to the set (#681)

[33mcommit d1c236eb09fae0b2ddaa5c2b75fac6a25f25cb27[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 27 11:56:23 2024 +0100

    Change certifiacte zone (#680)

[33mcommit e477fb86b38cd6498a298d3eac5978badeef7b16[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Feb 27 11:33:51 2024 +0100

    Revert "[DEV-1406] Handle the trailing slash of the URL (#679)" (#683)
    
    This reverts commit 3c8e6bedff7ef9113909a7aeb38bc1565a022398.

[33mcommit 3c8e6bedff7ef9113909a7aeb38bc1565a022398[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Tue Feb 27 09:27:37 2024 +0100

    [DEV-1406] Handle the trailing slash of the URL (#679)

[33mcommit 8e18a767673bd8276e86b989855f5242a9bfa8eb[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Feb 26 14:59:44 2024 +0100

    Revert "[DEV-1383, DEV-1384] - Create ECS and ALB for CMS Strapi (#637)" (#677)
    
    This reverts commit c0c4026fc18203826303b69aaee6e36bc4a81a5f.

[33mcommit c0c4026fc18203826303b69aaee6e36bc4a81a5f[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Mon Feb 26 14:19:03 2024 +0100

    [DEV-1383, DEV-1384] - Create ECS and ALB for CMS Strapi (#637)

[33mcommit 052fb9257f3c34fc5763a9e468922b3228dec680[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.11.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon Feb 26 11:59:50 2024 +0100

    Update CHANGELOG and prepare next release (#669)

[33mcommit 776c942f1963a6f5d11b908b0cbfdf8456acdbcd[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Mon Feb 26 11:49:16 2024 +0100

    [DEV-1381] - Create RDS Database Aurora for Strapi (#629)

[33mcommit 1323f1e8a5e4ccaac568df17eb8cc1f1bdc1f12e[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Feb 23 17:03:28 2024 +0100

    [DEV-1425] Refactor storage.tf file (#675)

[33mcommit 41cbc286bd2029ba8ea62aa733e20c80dd611611[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Feb 23 16:58:41 2024 +0100

    [DEV-1426] Split network file into two different files (#674)

[33mcommit 5c713aa53ab556aa846be2b732c06b10b08f6a04[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Feb 23 16:40:03 2024 +0100

    Remove numeric prefix to terraform files (#673)

[33mcommit 3e001904ac003c78b518e8404c66e76123fccb63[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Feb 22 11:17:10 2024 +0100

    [DPC-141] Change in version and name for "CGN" (#665)

[33mcommit 999b7dd3e48d45681f383b08ca9be5a35f55224c[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.2.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.10.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Feb 21 15:51:21 2024 +0100

    Update CHANGELOG and prepare next release (#651)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 3baac157d4b74c6a6f27059c65fb21b7e439db09[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Feb 21 15:40:50 2024 +0100

    [DEV-1400] Create developers readonly group and iam user (#649)

[33mcommit 1e4b96eeb251007001a23fbb9787f54da2b35bd8[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Feb 19 10:05:53 2024 +0100

    [DEV-1389] Migrate to cms the "Discover our ecosystem" section in home page (#632)

[33mcommit 945394d20d69663d09968b972e1b65b51a64fe06[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Fri Feb 16 14:51:10 2024 +0100

    [DEV-1385] - Add IAM Role to deploy strapi (#639)

[33mcommit 201c98d53034a854d253067e9672e56ea49ef61b[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Feb 16 11:49:29 2024 +0100

    [DPC-150] Correction of the sentence related to the pagoPA quickstart (#647)

[33mcommit 532f1d6c01328d9daa9cfb49499a8b4a63361c83[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Feb 16 11:35:55 2024 +0100

    [DEV-1336] Fix change password page and changed password page (#608)
    
    * Fix sign-in and confirm sign-in UI and UX
    
    * Add changeset
    
    * Fix sign-up and confirm sign-up UI and UX
    
    * Remove duplicated state constant
    
    * Remove useless fragment
    
    * Rename constant and add an explicit cast to avoid a linting warning
    
    * test(DEV-1333): add auth helpers' tests
    
    * Fix reset password request page UI and UX
    
    * Fix translations
    
    * Fix change password page UI and UX
    
    * Move ResentEmail component on bottom of the page
    
    * Add autoComplete param to textFields in LoginForm
    
    * Add changeset
    
    * Add changeset
    
    * Add missing translation and remove unnecessary console.log
    
    * Disable submit button on click while signing up
    
    * Disable submit button on click while asking for password reset
    
    * Remove un unnecessary dependency from React Hook useCallback's dependency array
    
    * Disable submit button on click while changing password
    
    * Catch missing Cognito error
    
    * Remove ghost translations
    
    * Revert "Remove ghost translations"
    
    This reverts commit d57a9c750b59d858fd8196260429bafb0330d9e7.
    
    * Update apps/nextjs-website/src/config.ts
    
    * Delete .changeset/lazy-poets-melt.md
    
    remove changeset of previus PR
    
    * Revert missing updated label after merge
    
    * Remove useless router replace
    
    * Update apps/nextjs-website/src/messages/it.json
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/messages/it.json
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Michele Da Rin Fioretto <michele.darinfioretto@uqido.com>
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit c58c050fcc75fc64f0a9ffe3b1f1e59d55748df4[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Feb 16 10:37:45 2024 +0100

    [DEV-1402] update banner link (#657)
    
    * update banner link
    
    * changeset
    
    * Update apps/nextjs-website/src/editorialComponents/BannerLink/BannerLink.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/editorialComponents/BannerLink/BannerLink.tsx
    
    fix lint
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit e99ffd4c258a7e352d1b5f4bb52fed4da76db8e7[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 15 16:29:38 2024 +0100

    Add fail-fast option to avoid cancellation of a job if another one fails (#654)

[33mcommit b66fdb03214cab42b6d6298b7fe6943097b0be45[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 15 16:16:51 2024 +0100

    Remove useless DNS hosted zone (#658)

[33mcommit bd8b6723fa1df154e8042cc88006db8eb9feb5d6[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 15 15:26:44 2024 +0100

    Update CMS SSL certificate provider and zone id (#656)

[33mcommit 319fd416b3f6c4de99ceb3b1fad5bdae4fa51359[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Feb 15 15:16:09 2024 +0100

    Revert "[DEV-1382, DEV-1394] Fix SSL certificate for cms domain" (#655)

[33mcommit f1a8984a52ff4406c3953a877dd038c531844af2[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Feb 15 14:56:57 2024 +0100

    [DEV-1403]: Add permission to devportal_authenticated_host_user

[33mcommit c317f1997811fbfb2eee9e0a112c814d70bcb6c6[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 15 14:55:44 2024 +0100

    [DEV-1382, DEV-1394] Fix SSL certificate for cms domain (#652)
    
    * Remove DNS zone of CMS
    
    * Update certificate zone id and provider
    
    * Do not wait for validation
    
    According to [documentation](https://github.com/terraform-aws-modules/terraform-aws-acm/blob/8d0b22f1f242a1b36e29b8cb38aaeac9b887500d/README.md?plain=1#L174), in CI environment we should not wait or we could encounter errors

[33mcommit b2ac24abacba4f4928f0e696bd70853b23fa0753[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Feb 15 13:10:57 2024 +0100

    [DEV-1335] Fix reset password request page (#605)
    
    * Fix sign-in and confirm sign-in UI and UX
    
    * Add changeset
    
    * Fix sign-up and confirm sign-up UI and UX
    
    * Remove duplicated state constant
    
    * Remove useless fragment
    
    * Rename constant and add an explicit cast to avoid a linting warning
    
    * test(DEV-1333): add auth helpers' tests
    
    * Fix reset password request page UI and UX
    
    * Fix translations
    
    * Move ResentEmail component on bottom of the page
    
    * Add autoComplete param to textFields in LoginForm
    
    * Add changeset
    
    * Add missing translation and remove unnecessary console.log
    
    * Disable submit button on click while signing up
    
    * Disable submit button on click while asking for password reset
    
    * Remove un unnecessary dependency from React Hook useCallback's dependency array
    
    * Fixes after merge with main branch
    
    ---------
    
    Co-authored-by: Michele Da Rin Fioretto <michele.darinfioretto@uqido.com>
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 68ac9bcf86bf8b4a3baa424ed318ad53a050b58f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Feb 15 12:57:44 2024 +0100

    [DEV-1390] Add Product schema and productsShowcase component to homepage in Strapi CMS (#631)
    
    * Add Product schema, controller, routes and service di Strapi CMS
    
    * Add productsShowcase component to Strapi CMS
    
    * Fix linting in controller autogenerated file
    
    * Add changeset
    
    * Update .changeset/sweet-planets-change.md
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * Add @strapi/provider-upload-aws-s3 and plugins.ts configuration file
    
    * Update .env.default file
    
    ---------
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: AF <alessandro.ferlin@pagopa.it>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 7ca58a05d06f986fb338669b5ac96f347bdd05d0[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.9.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Thu Feb 15 12:39:24 2024 +0100

    Update CHANGELOG and prepare next release (#648)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 732253444b8cef0ce7188ecbfa38199c2bd03be0[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Feb 15 12:13:26 2024 +0100

    [DEV-1334] Fix sign-up and confirm sign-up pages (#604)

[33mcommit 2b18a300f4ae23c8ffd390ac5e8348fc6a4ed599[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Thu Feb 15 10:27:42 2024 +0100

    [DEV-1386] - Create IAM Role ECS for CMS Strapi (#634)

[33mcommit c571989ad56a7a76732b2e28bf098484e25b1f26[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Feb 14 18:42:34 2024 +0100

    [DEV-1361] Fix edit password card in user profile (#609)
    
    * Fix edit password card in user profile
    
    * Add changeset
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 875b2cbb6d3e279b000e78b9f0d2fdfd2f4f8d9b[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Feb 14 17:27:29 2024 +0100

    [DEV-1375] Allow fetching documentation from a specific branch of the `devportal-docs`

[33mcommit c14d7e5fb843d687266c6b8cc5c916928a3aee08[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Feb 14 16:01:16 2024 +0100

    [DEV-1333] Fix sign-in and confirm sign-in UI and UX (#601)

[33mcommit 37d15c318471816ca1d535e5b099c1701988cc68[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Wed Feb 14 11:57:14 2024 +0100

    create-secrets-for-cms-strapi (#626)
    
    create-secrets-for-cms-strapi

[33mcommit f81d35185441e6294fd8ad8eb7e5017d931a527a[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Wed Feb 14 11:20:46 2024 +0100

    [DEV-1382] - Create Certificate for CMS Strapi (#636)
    
    * add-certificate-and-var-cms
    
    add-certificate-and-var-cms
    
    * add-dns-zone-cms
    
    add-dns-zone-cms
    
    * terraform-fmt
    
    terraform-fmt
    
    * remove-dns-zone-split-pr
    
    remove-dns-zone-split-pr
    
    * Update .infrastructure/11_certs.tf
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 70fd73311890f6e3dd6b10850799270b14c91e14[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Wed Feb 14 11:10:14 2024 +0100

    add-iam-user-for-cms-strapi (#625)
    
    add-iam-user-for-cms-strapi
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit e86fc9c9ca5df1e3d5b14bd3c0d4046b169a6351[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Feb 14 11:03:18 2024 +0100

    Improve jobs' name (#645)

[33mcommit 341715c3c3505c42cafccf568d8dd71fd072c4ee[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.9.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Feb 14 10:47:37 2024 +0100

    Update CHANGELOG and prepare next release (#643)

[33mcommit 4a9f40a03a60489c0629d41759906c0b5a96f2f4[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Wed Feb 14 10:36:16 2024 +0100

    [DEV-1394] - Create DNS zone for CMS Strapi (#640)
    
    * add-dns-zone-and-var-for-strapi
    
    add-dns-zone-and-var-for-strapi
    
    * update-comment

[33mcommit acd8fdb7ecfb2b62265be9b2d3f790cfd7984ebc[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Feb 14 10:26:31 2024 +0100

    [DEV-1387] Add fetch-depth option (#642)

[33mcommit 3d86bfc9fe0be59b988b095ac025901fee5318f6[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Feb 14 10:11:03 2024 +0100

    [DEV-1396] Remove expireAt form webinar questions (#641)

[33mcommit dbd06f0a94e286a82c38f84418f3cc590b85ddf8[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.9.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Feb 14 09:53:14 2024 +0100

    Update CHANGELOG and prepare next release (#619)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 2d53f34ceb3393a08207ca2c971e468b744b6c5d[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Tue Feb 13 17:32:25 2024 +0100

    [DEV-1376] - Add S3 and CDN  for CMS Strapi Medialibrary (#624)
    
    * add-s3-and-cdn-for-cms-strapi-medialibrary
    
    add-s3-and-cdn-for-cms-strapi-medialibrary
    
    * removed-comment
    
    removed-comment

[33mcommit a481265ef22038c4182a64f13efd9070fddfed3b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 13 14:47:36 2024 +0100

    [DEV-1363] Fetch homepage props from Strapi (#615)

[33mcommit 50f538fdd9968f6cb5269a48e7cb11edaef94460[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Tue Feb 13 14:35:45 2024 +0100

    [DEV-1054]: webinars questions page (#588)
    
    * feat(DEV-1054): add webinars questions page
    
    * chore: fix prettier errors
    
    * feat(DEV-1054): add webinars questions page
    
    * chore: fix eslint error
    
    * feat(DEV-1054): decrease interval time
    
    * feat(DEV-1054): fix typos
    
    * chore: add changeset
    
    * feat(DEV-1054): add spinner while loading questions
    
    * feat(DEV-1054): better logic
    
    * feat(DEV-1054): fix typo
    
    * feat(DEV-1054): better injection protection
    
    * feat(DEV-1054): usa intl message
    
    * fix: fix eslint error
    
    * Restore generateStaticParams function in webinar's questions page
    
    * Update apps/nextjs-website/src/components/organisms/WebinarQuestionsTemplate/WebinarQuestionsTemplate.tsx
    
    * Fixes after review
    
    * Remove dynamic import of WebinarQuestionsTemplate
    
    * feat(DEV-1054): remove user info
    
    * feat(DEV-1351): remove unused fields from dynamodb
    
    * feat(DEV-1351): remove unused code
    
    * feat(DEV-1351): remove unused code
    
    * feat(DEV-1351): remove unused translation
    
    * feat(DEV-1351): remove unused code
    
    * feat(DEV-1054): fix bugs
    
    * feat(DEV-1054): fix bugs
    
    * feat(DEV-1054): fix bugs
    
    * Update .infrastructure/50_storage.tf
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit b50b1efce59a0932921b11f8b484190b9aca5b69[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Tue Feb 13 12:52:34 2024 +0100

    create-elastic-container-registry-for-strapi-image (#627)
    
    create-elastic-container-registry-for-strapi-image

[33mcommit 3766290d9f9c24fee0981096f776ca0cce888ac7[m
Author: maurodandrea <98483756+maurodandrea@users.noreply.github.com>
Date:   Tue Feb 13 12:45:16 2024 +0100

    [DEV-1380] - Create VPC and Security Group for Strapi (#628)
    
    * create-vpc-security-group-for-strapi
    
    create-vpc-security-group-for-strapi
    
    * remove-locals-and-add-description
    
    remove-locals-and-add-description
    
    * remove-ingress-rule-alb
    
    remove-ingress-rule-alb
    
    * add-lifecycle-and-.comment-security-group
    
    add-lifecycle-and-.comment-security-group
    
    * terraform-fmt
    
    * Update .infrastructure/14_network.tf
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * Update .infrastructure/14_network.tf
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * Update .infrastructure/14_network.tf
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit e65aba98ec792f258f45209aff5e7bde89073c7e[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Feb 13 12:30:47 2024 +0100

    [DEV-1349] Suspend S3 versioning and add lifecycle policy (#620)

[33mcommit 2a137a209d24d12cb65d38373143fd7f5490ba2b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 13 12:09:55 2024 +0100

    Add new labels for PRs (#633)

[33mcommit 4b3be3e439c18ca82015738a72bc44e3daa1fd73[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 13 10:52:35 2024 +0100

    [DEV-1387] Fix build workflow (#630)

[33mcommit 74ac0114d158bcb7905c0ddfed1986d14eb43395[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Feb 12 15:05:39 2024 +0100

    [DEV-1372] Add Strapi's environment variables (#621)

[33mcommit 3bbd676b36f9049b386e7adc3fe856483b03cf10[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Feb 12 11:27:34 2024 +0100

    [DEV-1344] Add DynamoDB alarms (#603)

[33mcommit 9e7276f5bbc4a18eddcb08367baa0a72e650da4b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Feb 9 17:31:08 2024 +0100

    [DEV-1338] Add CloudFront alarms (#602)

[33mcommit 013a47f7e6347fc3c6fd8dc3765b98bd6ceb388f[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Feb 9 15:48:39 2024 +0100

    [DEV-1278]: uniform footer (#606)

[33mcommit 0c33e933e50a0d5af5bcb6e59b587e7f56d3772a[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Feb 9 15:27:59 2024 +0100

    [DEV-1348] Close mobile menu on click (#610)

[33mcommit 578bcfca340b7df591714d269d929faa27a7be93[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Feb 9 15:16:50 2024 +0100

    Fetch tags on repo checkout (#618)

[33mcommit c049819a7f6942148892c5dbe6718b91662f6222[m[33m ([m[1;33mtag: [m[1;33mstrapi-cms@0.1.0[m[33m, [m[1;33mtag: [m[1;33mnextjs-website@0.8.0[m[33m, [m[1;33mtag: [m[1;33mgitbook-docs@0.0.1[m[33m, [m[1;33mtag: [m[1;33meslint-config-custom@0.0.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Feb 9 14:54:15 2024 +0100

    Update CHANGELOG and prepare next release (#594)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 6daca6147421f0781c941f1bafed0c8405910427[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Feb 9 14:48:31 2024 +0100

    Instruct changeset action to create Git tags (#617)

[33mcommit b2060e085ad021cd568b1162558a2a8f647a6fd8[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Feb 9 12:33:53 2024 +0100

    [DEV-863] Changed broken link in gitbook (#616)

[33mcommit 4a34f5de69698009244d07663a815e681b3a7036[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Feb 9 10:20:28 2024 +0100

    [DEV-863]: add missing urls paths (#600)
    
    * feat(DEV-863): add missing urls paths
    
    * feat(DEV-863): add missing urls paths
    
    * chore: add changeset
    
    * test(DEV-863): add more tests
    
    * test(DEV-863): remove unnecessary tests
    
    * test(DEV-863): add missing urls
    
    * test(DEV-863): add missing urls
    
    * test(DEV-863): fix typos
    
    * test(DEV-863): fix typo

[33mcommit 910f54a8f245a7b65fbc5ec042c3f8e244e1758f[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 8 15:46:57 2024 +0100

    [DEV-1362] Add BuildEnv and Strapi utilities (#614)

[33mcommit 44ab2b60da22a59daef344a5d6af6a95d7389ad9[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 8 15:32:35 2024 +0100

    Add prevent_destroy to Cognito UserPool (#607)

[33mcommit 5561922ba29aee2c622f934bdd076dff941b3db5[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Feb 8 15:32:00 2024 +0100

    [DPC-139] update sync with docs/from-gitbook (#612)

[33mcommit b0c18a773180801ed319908224d4b8a640abf9a6[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Feb 8 14:39:59 2024 +0100

    [DEV-1340] Add homepage to strapi (#592)
    
    * update strapi
    
    * Fix error on managing endpoint permission
    
    * add homepage and related link
    
    * Fix linting problems
    
    * add generated to gitignore
    
    * update package-lock
    
    * update gitignore
    
    * add change set
    
    * Revert tsconfig update
    
    * add compile and precompile
    
    * Fix permission error and add comment
    
    * Update apps/strapi-cms/package.json
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * Update package-lock after merge with main
    
    * Rename home-page to homepage for consistency reasons
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>

[33mcommit 908bcaa3edde3d55528bfc7376046554022eaece[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 8 11:50:50 2024 +0100

    [DEV-1343] Add Cognito alarms (#611)

[33mcommit 1352c9ef2d3ac686fe289e1e9a42d7ec8376ab75[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Feb 7 16:02:59 2024 +0100

    [DEV-1364] Remove config file and create BrowserConfig (#613)

[33mcommit 4caeaafaf658dc181eba6873778401aba9e4ab1c[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Feb 7 08:56:32 2024 +0100

    [DEV-1314] EmailFormWrapper unit tests (#581)

[33mcommit 3d01f5b800a0dacac6016d92feb425cc4644868b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Feb 5 10:52:44 2024 +0100

    [DEV-1291] Add alarms for SES (#596)

[33mcommit 2370d7e32ea89fb94abbda22ef38bbfc1c568a69[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Feb 2 11:17:40 2024 +0100

    [DEV-866] Redirect to the main guide if no version is specified from the path (#507)
    
    * redirect to last guide if no one is specified from the path
    
    * handle main version
    
    * Create new-cows-melt.md
    
    * Update .changeset/new-cows-melt.md
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * improve logics
    
    * Update apps/nextjs-website/src/lib/types/guideData.ts
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/lib/types/guideData.ts
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * add main version for each guide
    
    * add main version guide
    
    * fix getMainGuide fn
    
    * changes after review
    
    * update logics for redirect
    
    * changes after review
    
    * remove unused regex
    
    * changes after review
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Jeremy Gordillo <jere.gordi@gmail.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 558d23c8bbcf93b18b07a0af00438307b3debdc4[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Feb 2 10:58:48 2024 +0100

    [DEV-863]: rewrite URLs if they point to https://docs.pagopa.it (#560)
    
    * feat(DEV-863): rewrite URLs if they point to https://docs.pagopa.it
    
    * feat(DEV-863): update guides mapping
    
    * feat(DEV-863): update switch cases
    
    * feat(DEV-863): add anchor and test
    
    * feat(DEV-863): fix sanitazion error
    
    * feat(DEV-863): fix sanitazion error
    
    * feat(DEV-863): fix sanitazion error
    
    * feat(DEV-863): update rewrite logic
    
    * feat(DEV-863): simplify logic
    
    * chore: fix eslint error
    
    * test: update test
    
    * feat(DEV-863): update urls map
    
    * feat(DEV-863): simplify logic
    
    * chore: update changeset
    
    * chore: remove wrong changeset
    
    * feat(DEV-863): fix typo
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit f67d23145a8978327be6081da8e38941fc6e1342[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Feb 1 18:35:26 2024 +0100

    [DEV-1238] Resizing the "Featured" section as the page loads (#591)
    
    * fix layout shift
    
    * Create orange-colts-listen.md
    
    * improve styles
    
    * fix after changes
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit e976969777821fe1df33a9b612f3b3bfe02d76ff[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Feb 1 18:14:17 2024 +0100

    [DEV-1089] Fix link's title parsing logic (#590)
    
    * Disable the link's title replacing with destination page title and leave it as it was in Gitbook
    
    * Fix linting error
    
    * Add changeset
    
    * Fixes after a new definition of the task
    
    * Update changeset description and remove redundant getBookPagesWithTitle cases in test config

[33mcommit 80260260907bba92c3209998ab9aa1edc9fc48bf[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Feb 1 17:18:57 2024 +0100

    Fix title alignment in API pages (#598)

[33mcommit a305b3ddd92d4bf81f91bebcd4850b5db29192d0[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Feb 1 11:35:09 2024 +0100

    [DPC-135] Show export button in StopLight Element's component of API pages (#597)
    
    * Show export button in StopLight Element's component of API pages
    
    * Add changeset
    
    * Fix changeset

[33mcommit 7a6ee42b4da918bc7956ab14f299f76643fb4b11[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Jan 31 16:52:39 2024 +0100

    [DEV-1162] Remove workaround from parse content (#585)
    
    * parse content
    
    * changeset
    
    * Update packages/gitbook-docs/src/parseContent.ts
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update .changeset/wicked-dots-attend.md
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit d39d27a71cf249ae6f9ee44a309a9b29524465db[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Jan 31 15:34:09 2024 +0100

    [DPC-138] Update docs from gitbook (#595)

[33mcommit b2f50b84b99a3bff19c0989798e116d42bf07cc7[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Jan 31 11:27:50 2024 +0100

    [DEV-1040] Add OpenAPI component (#353)

[33mcommit bcbe0b4d66e0d6483c667af26a6f6c4da26ff381[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.7.2[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Wed Jan 31 10:18:11 2024 +0100

    Update CHANGELOG and prepare next release (#593)

[33mcommit b9b9a21a3c37bfe2d8dac04b8899465a01c6c14e[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Jan 31 10:08:13 2024 +0100

    [DEV-1331] Fix xss issue (#589)

[33mcommit 4a592f7eba57a0e775ac893b78a5cbfd2ab0ff10[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.7.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon Jan 29 18:06:39 2024 +0100

    Update CHANGELOG and prepare next release (#587)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 8e9fcf2a6dd05f49355e31d9f415d062c2442104[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jan 29 18:02:04 2024 +0100

    [DEV-1276] Fix DNS record for domain verification (#584)

[33mcommit 7c3c6805e643850e46975a62d9464965c829c6c0[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Jan 29 16:57:58 2024 +0100

    [DEV-1327, DEV-1328] Fix speakers and speakersTitle label in Webinar section (#583)

[33mcommit 8434b2cacbd366667fe31310b3b76e86c3c52296[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jan 26 12:43:01 2024 +0100

    [DEV-1323] Update deploy workflow with new environments vars (#582)

[33mcommit b08c50f774d0f760a7312fe8538197daae0faba0[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.7.0[m[33m, [m[1;33mtag: [m[1;33mcognito-functions@0.1.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Fri Jan 26 09:45:07 2024 +0100

    Update CHANGELOG and prepare next release (#579)

[33mcommit dc5ece2b589f82bdcac1b625ad78b4290994bc6b[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jan 25 16:48:09 2024 +0100

    [DEV-1309] Update WebinarQuestionsForm to use dynamodb (#573)

[33mcommit 8943afe7d3901cbd7cf9c49084c5abcc29ec2276[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jan 25 15:19:37 2024 +0100

    Add TXT record due to domain ownership verification (#580)

[33mcommit eadf4e3fa8837beb70bce604a4b9a57a6cf580b6[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Jan 24 16:33:42 2024 +0100

    [DEV-1272] update attribute email (#532)
    
    * feat: update password from user profile
    
    * add translations & improve errors
    
    * changes after review
    
    * changes after review
    
    * add error state to password text field label
    
    * update message
    
    * Refactor personal-data page to handle both change password and change email
    
    * Add UX to edit email user attribute
    
    * Remove duplicated import
    
    * Fix distance from divider
    
    * Fix it.json indentation
    
    * Add changeset file
    
    * Handle errors and add expiredCodePage
    
    * Add error case and move signOut after router push
    
    * Use PageBackgroundWrapper component instead of Box
    
    * Rename state constant
    
    * Remove ExpiredCodeCard component
    
    * Move components to their own folder
    
    * Add 'use client'
    
    ---------
    
    Co-authored-by: jeremygordillo <jere.gordi@gmail.com>

[33mcommit d855202874015c5f5037b76af3074934077beabb[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jan 24 11:14:53 2024 +0100

    Add identity pool and dynamodb endpoints to CSP (#578)

[33mcommit ff76c4e0113cf4525de51d22f9312963b9ded7a7[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Jan 23 17:58:01 2024 +0100

    [DEV-1298] Fix microcopies in confirmation update email attribute's template (#574)
    
    * Fix microcopies in confirmation update email attribute's template
    
    * Add changeset
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 47561224fc8cd33e5c94ac45d48d14894ce5bb42[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Jan 23 14:41:57 2024 +0100

    Fix cognito assume role policy (#577)

[33mcommit 28fa8dd98454c9c8e9f6e6e93269d78383a7ac19[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Jan 23 12:23:45 2024 +0100

    [DEV-1312] Create resources to authorize Cognito users (#576)

[33mcommit 1d963aebd46d0334097d77b3fb886c269386cd0b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Jan 23 10:14:27 2024 +0100

    [DEV-1077] Create DynamoDB table for webinar questions (#575)

[33mcommit 5542ae0f575d810e9a70d97929bba1dc942f92be[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.6.0[m[33m, [m[1;33mtag: [m[1;33mcognito-functions@0.1.0[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Mon Jan 22 18:48:09 2024 +0100

    Update CHANGELOG and prepare next release (#561)
    
    Co-authored-by: github-actions[bot] <github-actions[bot]@users.noreply.github.com>

[33mcommit 0270936e96647db4ebfeb76e68c16ac2c57c6aa5[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Jan 22 17:27:26 2024 +0100

    [DEV-1311] Fix webinar view button (#572)
    
    * Fix webinar show button show only on webinars page and homepage
    
    * add changeset

[33mcommit 276253b327a7b67e21c63c80fafacaffd875b5e5[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jan 22 15:03:50 2024 +0100

    Upgrade AWS provider to 5.33.0 (#571)

[33mcommit fd8e04d88a14972909c683a958920b622d643212[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jan 22 14:32:03 2024 +0100

    PR size workflow should ignore .infrastructure/.terraform.lock.hcl (#570)

[33mcommit b2f7d88392dbaa91bc4efee166eaa070f431fbe9[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Jan 19 18:17:04 2024 +0100

    Add a prop to Hero component to add the style that removes the overlap between the product's menu and the Hero (#568)

[33mcommit 04246c9fa364355fa11f1f57423572c8028dcfcf[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Jan 19 11:26:06 2024 +0100

    [DEV-1022] Editable profile (#499)
    
    * editable profile
    
    * linter
    
    * pr comments
    
    * null check
    
    * pr comments
    
    * linter
    
    * fix merge artifact
    
    * Update apps/nextjs-website/src/components/molecules/InfoCard/InfoCardProfile.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Allowing empty values
    
    * required fields
    
    * Update apps/nextjs-website/src/app/profile/personal-data/page.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/app/profile/personal-data/page.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/app/profile/personal-data/page.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/app/profile/personal-data/page.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/app/profile/personal-data/page.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/app/profile/personal-data/page.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/components/molecules/InfoCard/InfoCardProfile.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/components/atoms/InfoCardItem/InfoCardItemProfile.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Update apps/nextjs-website/src/components/atoms/InfoCardItem/InfoCardItemProfile.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Fix select label
    
    * Fix profile layout
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>

[33mcommit 31b18bd7d46e82fe2acaf0e998ec75eb79d0883b[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Jan 19 09:38:23 2024 +0100

    Hide webinar link in production environment (#567)

[33mcommit 4698cbe11fcb6ae7d55de03bd62e98603789dbd1[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Jan 18 18:07:43 2024 +0100

    [DEV-1055] Add webinars list page (#538)
    
    * Add webinars list page
    
    * Fix layout and webinarSection title
    
    * Remove default cover image and mock webinars
    
    * Set webinar as visible
    
    * Rename WebinarsLayout to WebinarsTemplate and set it as dynamic
    
    * Remove comment
    
    * Add changeset file
    
    * Fix getPastWebinars method
    
    * Add useCallback to WebinarsTemplate functions

[33mcommit c98c1cf5c7d1e23f8071c9427d0af4d603fccab7[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Jan 18 11:14:02 2024 +0100

    [DEV-1235] Preload font (#566)
    
    * preload titillium font and set as important
    
    * add changeset
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit eed166c83a7128da557570cba335f5db2fa1124d[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Jan 18 10:56:33 2024 +0100

    [DEV-1213] Replace SiteHeader's mobile layout (#491)
    
    * Replace SiteHeader's mobile layout
    
    * fix(DEV-1213): update header on mobile
    
    * fix(DEV-1213): update header on mobile
    
    * feat(DEV-1213): update mobile header styles
    
    * feat: update transition property
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    ---------
    
    Co-authored-by: Michele Da Rin Fioretto <michele.darinfioretto@uqido.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 6af6358f1bf790ec70e4c083b0d8b8cfaa31fb0d[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jan 17 11:17:45 2024 +0100

    [DEV-1299] Handle user update attribute event in CognitoFunctions (#563)

[33mcommit 66fbc5ef350a1ce40dbfa127532a7726da3e6b67[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jan 17 11:09:19 2024 +0100

    Enable attributes_require_verification_before_update on email address (#565)

[33mcommit 4c3fa2fe5a7499969dc43b78e864f385f894f1d4[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Jan 16 10:29:47 2024 +0100

    [DPC-126] Update docs  sync (#562)

[33mcommit af54da5e1a074dc66476c1fdc75abd49ef12226c[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Jan 12 09:54:04 2024 +0100

    [DEV-1233] Sanitize webinar question input (#534)
    
    * Sanitize input
    
    * revert api
    
    * revert
    
    * changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 59c5c0ae3bf0e0ed9040ad864e553c84ed682ab6[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Thu Jan 11 22:08:59 2024 +0100

    [DEV-1236] Fix vertical align (#531)
    
    * redirect to last guide if no one is specified from the path
    
    * Fix vertical align
    
    * linter
    
    * remove modifications not related to this pr
    
    * pr comments
    
    * changeset
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit efab9d0aedf5052dcf18db816606f8d86bcd4929[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Jan 11 18:36:58 2024 +0100

    [DEV-1273] Move white background color from main tag to body tag in layout.tsx (#537)
    
    * Move white background color from main tag to body tag in layout.tsx
    
    * Add BodyWrapper to use theme's white color
    
    * Fix background color
    
    * Add changeset

[33mcommit 808285d2cb0300d918d04a1bac414405ef048190[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Jan 11 18:16:09 2024 +0100

    [DEV-1243] Guide mobile menu (#535)
    
    * Implementation of mobile guide menu
    
    * refactor top position value
    
    * refactor
    
    * design improvements
    
    * fix duplicated translation key
    
    * Create thirty-eels-notice.md
    
    * udpate changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit d0fbfb237a8ddbd37079674c331d91e9f4c59cbf[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Jan 11 18:04:09 2024 +0100

    [DEV-1239] Implementation of user profile mobile menu (#527)
    
    * Implementation of user profile mobile menu
    
    * align styles to design
    
    * Create ninety-berries-promise.md

[33mcommit 56fb867d18fc9f53fdf81e9140d8a3f72cfbd2a7[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Jan 11 17:47:28 2024 +0100

    [DEV-1277] Update profile page copy (#554)
    
    * update profile page copy
    
    * add changeset
    
    * update changeset
    
    * removed ghost labels
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 5deece4aa0ba22df407e4f7ff18c1e226f549c5e[m[33m ([m[1;33mtag: [m[1;33mnextjs-website@0.5.0[m[33m, [m[1;33mtag: [m[1;33mcloudfront-functions@0.0.1[m[33m)[m
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   Thu Jan 11 17:36:38 2024 +0100

    Update CHANGELOG and prepare next release (#557)

[33mcommit 328df36e5b1ed9bb5c4404e3741113fa8406a000[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Jan 11 16:44:14 2024 +0100

    [DEV-1234] Updated lambda checks to prevent .woff2 font requests from being modified (#559)

[33mcommit 59fe6b08fd6643631c0d1dcc2214e81e939a7c51[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Jan 11 14:06:34 2024 +0100

    [DEV-1254]: fix mobile layout on guides' pages (#529)
    
    * fix(DEV-1254): fix mobile layout on guides' pages
    
    * feat: add changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 258ae2bbf8800564e5e50cc789b12879282d9ab3[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Jan 11 12:22:39 2024 +0100

    [DEV-1241]: fix mobile slider overflow (#530)
    
    * fix(DEV-1241): fix mobile slider overflow
    
    * feat: add changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 89b45c6cff7c45860d37354115315309f9f24524[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Jan 11 12:14:11 2024 +0100

    [DEV-829]: Improve scripts loading (#542)
    
    * fix(DEV-829): use Script component for scripts
    
    * feat: remove priority prop
    
    * feat: add changeset
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 83d265e6b2483f6abafa1548514cb1d5e4ec6ccd[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jan 11 10:25:43 2024 +0100

    Replace user handles with team group name and add new rules (#558)

[33mcommit de513612c685d393aed45bbbab65e6f2c9a66369[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Jan 11 09:20:45 2024 +0100

    [DEV-1242]: fix mobile carousel margin (#533)

[33mcommit 31048377bae511f777e81460bc0d4e32a02e7c76[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jan 10 18:11:08 2024 +0100

    Add log_retention_days parameter to cloudwatch (#556)

[33mcommit afc6693ab6b4e4e47a228ce45ddcb673b1b0408b[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Jan 10 17:31:17 2024 +0100

    [DEV-868]: remove hardcoded colors (#543)

[33mcommit 35e59c249378dc00c2b3336e0396bd8c757c4641[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jan 10 17:23:09 2024 +0100

    Move npm i from changesets workflow to the script (#555)

[33mcommit 435603254ca36ef047a5cbf92b759aace8ecc038[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Jan 10 15:59:36 2024 +0100

    [DPC-125]Update version Guida tecnica (#551)

[33mcommit c533c613a8fb6b8d3571008aee5717df8c18b67f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Jan 10 15:49:51 2024 +0100

    [DEV-1289] Fix typo in readme (#553)

[33mcommit d1b3c0ed99dcd1744e15ed16ee8d3322ac119cd2[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jan 10 11:47:52 2024 +0100

    [DEV-847] Add changesets (#552)

[33mcommit 28e84c52756f55bef14867e06d752ea1a04152bd[m[33m ([m[1;33mtag: [m[1;33m0.4.1[m[33m)[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jan 10 09:56:48 2024 +0100

    Release version 0.4.1 (#550)

[33mcommit dfd409c134a64d9f24f896f6ada651ae9272cd26[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Jan 10 09:41:27 2024 +0100

    [DPC-112] Update developer-portal/docs (#526)

[33mcommit 0ad37452f78148901044814ffa3fbb3d60f8d54e[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Tue Jan 9 17:25:40 2024 +0100

    [DEV-1253] Translations refactor (#539)

[33mcommit 1d831d05300e5b34db7a7f1a4458b3a97c4ec7a1[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Jan 9 17:12:14 2024 +0100

    [DEV-1286] Update codeowners (#549)

[33mcommit 671f3efb812c98761fb48699e4e79a15e2b7869d[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Jan 9 10:42:22 2024 +0100

    [DPC-119] Update version SACI & SANP (#498)

[33mcommit 3b73bed4b36c834045670171071c2c5481bf9904[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Tue Jan 9 10:32:01 2024 +0100

    [DEV-1229] Manage missing closing file tag in markdown files (#514)

[33mcommit ba76483c16302bfed65022f787c4fee8604a58fc[m[33m ([m[1;33mtag: [m[1;33m0.4.0[m[33m)[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jan 8 16:15:11 2024 +0100

    Bump version of website (#547)

[33mcommit b3118181d175f731a14d92b56f0e5be6aed83bb6[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Mon Jan 8 15:52:02 2024 +0100

    fix(DEV-1226): fix timezone on webinars' dates (#520)

[33mcommit f9fdc00de45a833f4d52f430df689f1c4a51ad5b[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon Jan 8 15:28:21 2024 +0100

    [DPC-116] Chenge il url from io-sign-->firma-con-io (#525)

[33mcommit 164741eebf2c3fc254b6945ef68c164a0e490ba6[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Mon Jan 8 15:18:28 2024 +0100

    [DEV-1153] Redirect after login (#485)

[33mcommit 183b5b9e1fd77da3f6997813685f030109c7060b[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Mon Jan 8 15:09:34 2024 +0100

    [DEV-1149]: errors translations (#471)

[33mcommit ec0980cece080097db927eea02026d18a6a958f4[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon Jan 8 12:25:29 2024 +0100

    [DPC-123] update list order for "Manuale Operativo" (#544)

[33mcommit b1d5328aef71f5602952a91f0cdc90ac42b1f3dc[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon Jan 8 11:49:31 2024 +0100

    [DPC-115] Change in name "App IO" (#545)

[33mcommit 13e6054e5e91a792e8b4107cf093f0e25b12133c[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Jan 2 18:01:32 2024 +0100

    Refactor CSP parts to improve readability (#522)

[33mcommit 8ab424336e77e2dc97cc59037413392100974996[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Jan 2 17:16:55 2024 +0100

    [DPC-122] Update  version knowledge base SEND (#524)

[33mcommit c6e64cece39d0265afe75543f2562230f8071dbf[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Jan 2 11:40:46 2024 +0100

    Remove x-robots-tag custom header (#540)

[33mcommit c0fbcba85068652963aeb0f287ccb9724d75121e[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Tue Jan 2 10:42:57 2024 +0100

    [DEV-997] Change password from user profile (#487)

[33mcommit 0de441669f08facea38e6020fc7a3b59cf16e19a[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Dec 21 10:28:00 2023 +0100

    Set X-Robots-Tag to 'all' in prod's terraform variables (#536)

[33mcommit f6a37865d2b0ee3f0c93324f8adb17738c3decb9[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Tue Dec 19 15:21:18 2023 +0100

    fix(DEV-1250): update policy text with links (#528)

[33mcommit 6b1ce13506ee0232ee3a1f793f89a51c88f27550[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Dec 14 12:01:05 2023 +0100

    Remove script.google* from CSP (#521)

[33mcommit 0d841dadce85fd7e98e40f672733dfa51ce64ba8[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Dec 13 16:50:34 2023 +0100

    [DEV-1237] Fix region of dashboard (#519)

[33mcommit 323280049feff34c449cfb90bb1628c88a07a58f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Dec 13 16:31:29 2023 +0100

    Update current time stamp in handleWebinarState method (#513)

[33mcommit e8b155c2703b962ad43cbfd993e2cd1776fd9f29[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Dec 13 16:09:32 2023 +0100

    [DEV-1237] Add simple main dashboard (#517)

[33mcommit 310163c2d467ad20f6aafcfa2dee4d3dac3d68c0[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Dec 13 15:58:36 2023 +0100

    Revert "[DEV-1224] Add hidden live webinar (#509)" (#518)
    
    This reverts commit e5ded82dd330bb15e23a633638fa9a891fc1620f.

[33mcommit 3d96aa9fad1d7686b96c8c5dac85d522af9988fd[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Dec 13 15:05:59 2023 +0100

    Add missing unique "key" prop to TableD element (#515)

[33mcommit 9aad05f64e40e0a04a5040c924db7b2b454679ef[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Dec 13 12:22:52 2023 +0100

    Add Vimeo CDN to CSP (#516)

[33mcommit 3e67b3269aa2452f35cec1a2ede1b1fca44c6e11[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Dec 13 11:19:02 2023 +0100

    Pin version of terraform modules (#512)

[33mcommit 7cd09d9f387d0a672e76e8e17ddbd7ea98839df7[m[33m ([m[1;33mtag: [m[1;33m0.3.0[m[33m)[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Dec 12 18:04:27 2023 +0100

    Bump version of website (#490)

[33mcommit bb2251c0d9fcbd64991af678001f826492831628[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Dec 12 17:55:51 2023 +0100

    Set a different coming soon delta (#511)

[33mcommit 919e9d7d96867de44d2663819e5b571c79bc218f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Dec 12 17:28:54 2023 +0100

    Set webinar section title on a date base (#510)

[33mcommit e5ded82dd330bb15e23a633638fa9a891fc1620f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Dec 12 17:06:35 2023 +0100

    [DEV-1224] Add hidden live webinar (#509)
    
    * Add isVisibleInHome attribute to Webinar type to manage Webinar visibility in home page
    
    * Fix function name
    
    * Set isVisibleInHome as mandatory
    
    * Add mock hidden webinar

[33mcommit 65b3ac9d70b801ba2df2fad59eab2f41d1c2b30e[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Dec 12 16:53:23 2023 +0100

    [DEV-1223] Add isVisibleInHome attribute to Webinar type (#508)

[33mcommit 5de46312c9dbe7e83fc56e3ff35a9975bd3d181a[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Dec 12 16:38:28 2023 +0100

    Fix webinarCard margins (#506)

[33mcommit 8f38d4621d63926564258f69c3857b24393ac40e[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Dec 12 16:31:16 2023 +0100

    Add goToWebinar label to WebinarCard (#505)

[33mcommit c6877284f0e43c9fab7b93ec4602ba11bebe6423[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Tue Dec 12 16:15:46 2023 +0100

    [DEV-1136] Filtering of webinars by date now happens client side (#502)
    
    * Filtering of webinars by date now happens client side
    
    * pr comments
    
    * Fixes after code review
    
    * Fixes after code review
    
    ---------
    
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>

[33mcommit 259cdde0d2961d64e1dba4598eea57deca22547d[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Tue Dec 12 16:07:56 2023 +0100

    [DEV-1028] - Connect webinar questions (#500)
    
    * add webinar questions form
    
    * add disabled prop
    
    * Move ProfileMenu component to organisms folder
    
    * Add webinar player section to webinar detail page
    
    * changes after review
    
    * add question helper and update config
    
    * update question form and add errors
    
    * add guard on missing variable
    
    * add variable to workflows
    
    * Set dynamic elements in webinar details page
    
    * Fix linting
    
    * Uncomment exit guard
    
    * remove api key and defaults
    
    * show question only if webinar is live
    
    * add mock webinars for testing
    
    * fix mock webinar
    
    * Apply suggestions from code review
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    
    * Add webinar type
    
    * remove mock
    
    * Apply suggestions from code review
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * remove type
    
    * Fix after review
    
    * Fix addWebinarQuestion signature
    
    ---------
    
    Co-authored-by: jeremygordillo <jere.gordi@gmail.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 0c38b1df78a168b0108f1edfc4491a1024ee58fc[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Dec 12 09:45:01 2023 +0100

    Add scripts.googleusercontent (#504)

[33mcommit d6c6c852ef6871673a070cd1bfa7c4b3ab17936b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Dec 11 16:10:34 2023 +0100

    Add scripts.google (#503)

[33mcommit ff93f6b71abdb5305309eba368654ef25873c79d[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Dec 11 16:02:06 2023 +0100

    [DEV-1218] Add dynamic elements in webinar details page (#501)

[33mcommit b5ea5a820c9bfe3a2ea7754adf0e2fb447422381[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Mon Dec 11 15:43:29 2023 +0100

    [DEV-1080] Webinar questions form (#492)

[33mcommit de58092c523761d3419e826e51ff3e7286117ee7[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Dec 11 15:35:44 2023 +0100

    [DEV-1027, DEV-892] Webinar player section (#494)

[33mcommit c229976a133e34692c37b48f57d7ed6b6cb66fa5[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Dec 11 15:29:53 2023 +0100

    Add vimeo to CSP (#497)

[33mcommit faa2db6e34ba4eea1f70108dbd34076f74f649b1[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Dec 6 09:47:56 2023 +0100

    [DPC-102] Added new tutorial SEND (#495)

[33mcommit f22e69a989892255e97e6658639ff4e9b68e0352[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Dec 5 17:39:27 2023 +0100

    [DPC-102] New tutorial SEND sync (#493)

[33mcommit f0201d659fd1c866b8f11573d05258d8da9caca4[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Dec 1 16:35:41 2023 +0100

    [DEV-1205] Added image for io webinar (#482)

[33mcommit ce3d060c82c0687830473028fcf475d4c1e3efe0[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Dec 1 14:26:11 2023 +0100

    Replace default image for meta tags (#488)

[33mcommit fc8078e0d82b2508bee7f6e9ad6833c4fcc35d68[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Dec 1 12:41:53 2023 +0100

    [DEV-1206] Change definition in it.json file (#483)

[33mcommit a177c62d08cb3d06091d7fc09103b661fd5e04c1[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Thu Nov 30 10:51:10 2023 +0100

    [DEV-1204] og tags (#478)

[33mcommit c6f6e39e36d44a0226b841baa95846259ef8d71f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Nov 29 18:35:10 2023 +0100

    [DEV-1154] Set longer snackbar duration (#475)
    
    * Add env variable to set Snackbar auto hide duration
    
    * Add env variable to set the time in milliseconds the user must wait before resending the email
    
    * Fix convertToNumberOrUndefined function to catch NaN values
    
    * Fixes after code review
    
    * Restore empty row

[33mcommit f61afff53750e7a7305752d708c50d41c2ed83a6[m[33m ([m[1;33mtag: [m[1;33m0.2.0[m[33m)[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Nov 29 11:59:43 2023 +0100

    Release version 0.2.0 (#481)

[33mcommit b7cdc09a9b2a0b2258b218e5edc776d7985bb022[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Nov 29 11:54:15 2023 +0100

    Revert "Release version 0.2.0 (#479)" (#480)
    
    This reverts commit 41a47fd26e2cb4a049f1e5673707fe225ff8728e.

[33mcommit 41a47fd26e2cb4a049f1e5673707fe225ff8728e[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Nov 29 11:48:08 2023 +0100

    Release version 0.2.0 (#479)

[33mcommit 3c8cd1fcd7db2df58104f7fa6bfc733ad3eaafdb[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Nov 29 11:26:06 2023 +0100

    [DEV-1151]: translate role on profile page (#467)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit c432458f9c7551fe1e94d4e0b37bdb4148d1583d[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Nov 29 11:12:24 2023 +0100

    [DEV-1090] Fix inline images (#425)
    
    * [DEV-1090] Fix inline images
    
    * [DEV-1090] Fix inline images
    
    * Pr comments
    
    * selector with has
    
    * fix regression
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit a6b9bf0fc5e2418a7245bf090f252649fb36ca24[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Nov 29 11:08:35 2023 +0100

    [DEV-1165] Table items on multiple lines (#458)
    
    * fix new line
    
    * merge
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 7990f2ef551feb89bd4041ff8ce6401d4363e97d[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Nov 29 10:55:08 2023 +0100

    [DEV-1009] Fix tables too wide causing the menu to disappear (#468)
    
    * DEV-1099, fix tables too wide causing the menu to disappear
    
    * fix responsive
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 210b8fa69ed960a5353b1c69560174b9395781d8[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Nov 29 10:31:50 2023 +0100

    add translations (#474)

[33mcommit 05f7507b3e810560ef388a9b985fb267ab16fee5[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Nov 29 09:52:05 2023 +0100

    Remove meta tag (#477)

[33mcommit 1e926543ee9ad701d7da64715862633ffe991107[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Nov 28 17:53:35 2023 +0100

    [DEV-1100] Move cookie banner script to a client side rendered component (#472)

[33mcommit 1412c00455d2bcc1f9b9773eefd5e4b5aa5daecb[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Nov 27 18:31:30 2023 +0100

    Add timeout to lambda functions (#473)

[33mcommit 81ea40e65a497d5fd21b8476b370335cc21bd7e3[m[33m ([m[1;33mtag: [m[1;33m0.1.0[m[33m)[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Nov 27 16:46:20 2023 +0100

    [DEV-1191] Fix add NEXT_PUBLIC_ENVIRONMENT env variable (#470)
    
    * Fix add NEXT_PUBLIC_ENVIRONMENT env variable
    
    * Replace NEXT_PUBLIC_ENVIRONMENT value "development" with "dev"
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * Update .github/workflows/code_review.yaml
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * Update .github/workflows/deploy_website.yaml
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * Update .github/workflows/deploy_website.yaml
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 7a8da1bef26c5a43bb633e74061f557f553979e6[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon Nov 27 15:52:03 2023 +0100

    [DPC-117] changed link to SEND in footer (#469)

[33mcommit e87a81c7b9e1e8edc6ab4f4b4dd224455e8a4ac8[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Nov 27 11:06:20 2023 +0100

    [DEV-1188] Fix mobile site header layout (#465)

[33mcommit 978628e97eb9d1c7221bf0a0a939663198515299[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Nov 27 10:47:57 2023 +0100

    [DEV-1186] Reload page at logout (#466)
    
    * Reload page at logout
    
    * Avoid error page on back

[33mcommit b5db83592b69edfbb9d66458300879d8a43d7d5c[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Nov 27 10:18:07 2023 +0100

    Fix content (#464)

[33mcommit dca34c8f088e6d11fe2d18d168789a9a3e0c950b[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Nov 24 18:38:08 2023 +0100

    [DEV-1170, DEV-1171] Add new versions of Privacy policy and Terms of service (#463)

[33mcommit 8b70347ffd3a6d11bc4e1c49396a32e0ff87ad52[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Nov 24 18:37:13 2023 +0100

    Remove isProduction filter (#462)

[33mcommit 253a99aaaf1189f9967463711357c9dff8720b8d[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Nov 24 18:32:50 2023 +0100

    [DEV-1140] manage unconfirmed user with expired code (#459)

[33mcommit 48be519348a81b8b581e2e058417accdcfc3eeb9[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Nov 24 18:07:52 2023 +0100

    [DEV-1181] Fix confirm login copy (#461)

[33mcommit 8d9d5fc1f65fc0dd36f468a7f0e8635b12da4f52[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Nov 24 17:26:46 2023 +0100

    [DEV-1175] Custom error if user is confirmed (#460)

[33mcommit fbbeff47667c42f710aabd4014c2263a20fc55d3[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Fri Nov 24 17:13:16 2023 +0100

    [DEV-1152] Disable submit button on form submission (#431)
    
    * chore: disable button on form submission
    
    * add submitting state
    
    * changes after review
    
    ---------
    
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit b5d3f19a2c0c5e3556977bd787df23aa6ee40e7a[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Nov 24 16:13:22 2023 +0100

    [DEV-1168] manage webinars subscription withuser preferences (#443)

[33mcommit 90291e02a4325a76a553192b420d191b4225ec4a[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 24 14:59:59 2023 +0100

    [DPC-101] Removed outdated tutorial (#455)

[33mcommit c35149fc5d669ba574d7acf6edf4b03790a92c77[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 24 14:44:03 2023 +0100

    [DPC-110] Changed slug for webinar (#457)

[33mcommit f4c1fd66d3027a296dab977236078c1efb227c1e[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 24 13:41:06 2023 +0100

    [DPC-92] review Quick start SEND (#456)

[33mcommit b7c2c0247423b6a3821ad8a81c7664f01dc86a56[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Nov 24 12:26:17 2023 +0100

    Update copy of agreements page (#453)

[33mcommit 3a28ce8f031fc80b70f22a140c7e809059145f3e[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Nov 24 12:22:46 2023 +0100

    [DEV-1173] Fix OTP email template and copy (#452)

[33mcommit dd382fddfb2c4b7deeccb1219a69ab8279a8c458[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Nov 24 11:32:48 2023 +0100

    [DEV-1133, DEV-996]: User menu (#427)

[33mcommit 98d4c707f1f8db2e9067ebda0e95d2cfe7b6edfe[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Fri Nov 24 10:22:39 2023 +0100

    [DEV-1160] Add fallback icon for missing webinar speaker image (#429)
    
    * refactor: SpeakerPreview component
    
    * feat: add speaker avatar fallback
    
    * changes after review
    
    * fix lint error
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit ea2a4f10905538d44c34be3308b6e3a807efa6e4[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Nov 24 09:43:42 2023 +0100

    add redirect cta to login after signup (#448)

[33mcommit 5fe05782f79121750bacbc3e9bf9ced455fa28ba[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 24 09:34:37 2023 +0100

    [DPC-111]Update url APi pagoPA (#451)

[33mcommit 83986024d7df3fe22d0b09c305051eccc8f86d4a[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Nov 24 09:09:15 2023 +0100

    Fix cleanup phase (#450)

[33mcommit 1f8afad7313cd32a8f26d8562444f8a91e0c3484[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 24 09:01:04 2023 +0100

    [DPC-110] Webinar service management IO (#447)

[33mcommit 5fa4d3e26d8cdc3e85e17e33ea418e233c7e7dca[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Nov 24 08:53:36 2023 +0100

    [DEV-622] Remove crawler block (#301)

[33mcommit a8565735660b9d19e0dce10e917cf7d99292659a[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Nov 24 08:39:14 2023 +0100

    update email button (#449)

[33mcommit 24e48fc7b2a4235747d51b723c4f7a1eb1f4ce75[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Nov 23 17:39:30 2023 +0100

    style: improve mobile layout (#430)
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 56e44131ac4eb72a6f49d4a1f07828afbbb01e57[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Nov 23 17:31:53 2023 +0100

    [DEV-1126] Add menu to profile section (#441)
    
    * Add menu to profile section
    
    * Add PageNotFound import
    
    * Add PageNotFound guard
    
    * Fix missing loading
    
    * Use Spinner component when profile section is loading
    
    ---------
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>

[33mcommit 47efbb580ad5776225b52c03b6cc5c6010fa3946[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Nov 23 17:17:51 2023 +0100

    [DEV-1159] Add Spinner component (#436)
    
    * Add newsletter subscribe/unsubscribe button to profile's agreements page
    
    * Remove DevPortalUserAttributes type
    
    * Add Spinner component
    
    * Remove PageNotFound and Spinner exit guards from personal-data page (they will be replaced by ProfileMenu ones)
    
    * Remove useless import
    
    ---------
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 170c795928a48c5a726bb2c766cce8d915e24dec[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Nov 23 17:03:43 2023 +0100

    [DEV-1139] Prevent verified user to receive a new verification email (#424)

[33mcommit 6c110aadb68ef1ac331145f5a7153e5f440c7248[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Nov 23 16:42:46 2023 +0100

    [DPC-107] update arcade link (#446)

[33mcommit 34dfbd96fa68cd4129a1ad8c9b4abd14c96d32df[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Nov 23 16:31:55 2023 +0100

    [DEV-746] Generate and add metadata tags on pages (#310)

[33mcommit a09ad5b8a573c5285da2dc2c3a6bf5b606e26bef[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Nov 23 16:23:14 2023 +0100

    [DEV-1141, DEV-1142] Signup and Confirm signup copy (#442)

[33mcommit f83f0881b98229605dd77f3b0045d1899e852b3a[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Thu Nov 23 15:48:23 2023 +0100

    [DEV-1163] table checkboxes on true / false values (#445)

[33mcommit 616c6aa165e2518e89b336249d7f7ee8158a07ca[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Nov 23 15:16:22 2023 +0100

    [DEV-1117]: Resend email feedback (#426)

[33mcommit 0a16359d924db25854fe90e73ce8e65f6d07124e[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Nov 23 12:32:03 2023 +0100

    [DPC-100] Change in overview page SEND (#444)

[33mcommit f72fee62d455218d6f18a5207186bbd711e5afe7[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Nov 23 12:17:00 2023 +0100

    [DEV-1073] add subscribe button (#438)

[33mcommit 0231deeed5bc75148d05b211f3a6fabd20a8e872[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Nov 23 09:55:54 2023 +0100

    [DEV-1166] Add newsletter subscribe/unsubscribe button to profile's agreements page (#428)
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>

[33mcommit 11c7efadbbdebccdf380428eaad37d97ba162750[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Nov 23 09:45:25 2023 +0100

    [DEV-1100] Cookie banner close automatically (#402)

[33mcommit 9764427bdd14946db789168ab429849fdf6d56e9[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Nov 23 09:10:55 2023 +0100

    [DPC-108] Replace Self Car with Area riservata (#434)

[33mcommit dae2d83a491d07af948fa391c10fb2d1ce573eae[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Nov 23 09:02:21 2023 +0100

    [DPC-97] added icon for new tutorial app IO (#440)

[33mcommit bbb54460e5ce4bbccf1b621246d7f235bb0c6d14[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Nov 22 12:02:32 2023 +0100

    [DPC-66] Update docs from gitbook (#433)

[33mcommit 1fedf91b25b3e99d4b696887bcd0ac344d2bfd21[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Nov 20 18:10:16 2023 +0100

    Change from email address value (#423)

[33mcommit 547a8554279d631512163b7b3a8042d020089656[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Nov 20 17:50:29 2023 +0100

    [DEV-1095] Custom template for OTP (#422)

[33mcommit ed679b1e39a10716d23deebdeda575261fc0a294[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Nov 20 15:25:07 2023 +0100

    [DEV-1020] Add delete account section (#421)

[33mcommit 5d206a7b950e580b9f5fac4e1b8a1a5ce9ec87c3[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Mon Nov 20 14:56:15 2023 +0100

    [DEV-1119] add profile personal data page (#412)

[33mcommit 74e7d92a50c474d245570990954f28ab70118130[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Mon Nov 20 14:26:02 2023 +0100

    [DEV-1065] New Webinar notification banner (#362)

[33mcommit 59dc91db680e2a936b41959c8e84965a26ba33c9[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Nov 20 14:20:48 2023 +0100

    Show auth pages on production (#420)

[33mcommit 9c0cfdcfa9d28b5ad141026cc37e18c54d9577c6[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Nov 20 12:36:26 2023 +0100

    [DEV-1132] Add user preferences attribute (#419)

[33mcommit ad12e4231a8b8abc54b9a7f25f3c8c1c5ba584e5[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Nov 20 12:25:47 2023 +0100

    Remove prod as environment to perform deploy automatically (#418)

[33mcommit 584ef99a9a69cf8850cfa709b4e5ce440924804c[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Nov 20 10:46:10 2023 +0100

    [DEV-1120] Add agreements page (#406)
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 7ad8828a48c065ac9a548a8b732dbdb817ff411f[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Mon Nov 20 08:51:47 2023 +0100

    [DEV-1122] Add options to sign up form (#416)

[33mcommit 1fa0a66a1d500cf4eaf91380d16e0a897488daff[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 17 16:18:40 2023 +0100

    [DPC-104] Added new manual App IO (#417)

[33mcommit 3daf8cdfefa22a79aba2c7d9aa3a937ab954a272[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Nov 17 15:01:32 2023 +0100

    [DEV-1086] Fix incorrect code snippet inline parsing (#413)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 5e1c8825d46f6eaa96eb1e7d4eb017a848072003[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Nov 17 13:08:42 2023 +0100

    Add the showInOverview property to TutorialData to select Tutorials on overview pages (#409)

[33mcommit 7a41f042ecc641c97760fa5d58bc97ac082aa559[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 17 11:53:18 2023 +0100

    [DPC-92] Typo error (#415)

[33mcommit ae38d6fbf806fd0d60abf8bed6f37d385539ae70[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Nov 17 11:01:56 2023 +0100

    [DEV-1094]: Login MFA flow (#407)

[33mcommit 70c46cfea5400cc8fd4516b8b4e5aa21a1c4c58e[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Nov 17 10:49:05 2023 +0100

    [DEV-1125] Fix issue about logo on email (#411)

[33mcommit 9c513d9275f62f0cb3d66d6307caccfaa7859918[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 17 10:38:29 2023 +0100

    [DPC-88] Update pagoPA manuals (#404)

[33mcommit 9ef7d874a63fdbfd6e3c53d539a3f4f87adf7d11[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Nov 17 10:18:14 2023 +0100

    [DEV-1108, DEV-1109, DEV-1111, DEV-1112]: Reset password flow (#399)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 80cc42bee9a80e406226f49828a91277a9307ea7[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Nov 17 09:12:46 2023 +0100

    [DEV-1123] - Improve PostConfirmationTriggerEvent handling (#410)

[33mcommit 6cfd1fa6a29a92e4ae64b0e46360b46a676c1603[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Nov 16 17:57:36 2023 +0100

    [DEV-1124] Remove encodeURI (#408)

[33mcommit bbcdd79a39a01412655eefab476eb427caee01c3[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Nov 16 16:38:12 2023 +0100

    Refactor on MJML parser (#403)

[33mcommit e87c52807c7dc3f0037ff2f6a6f54fbd64482daf[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Nov 16 16:27:59 2023 +0100

    [DEV-1121] Improve cognito-functions build (#405)

[33mcommit 270b385a4d9dfacbbad43812aec16c35ef622fb8[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Nov 16 15:11:34 2023 +0100

    [DEV-1115] Added parsing for links to new spaces with URL '127.0.0.1:… (#394)

[33mcommit 485c7dd6a0870a17c9fb1f413735b9a87044bd6c[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Nov 16 12:45:55 2023 +0100

    [DEV-1110] - Add forgot password email handler (#401)

[33mcommit b6f57cb9941563cd911e72d37e7619a067aee15e[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Thu Nov 16 12:41:56 2023 +0100

    [DEV-1045]: header user info (#369)
    
    * feat(DEV-1045): add user info on header
    
    * feat(DEV-1045): add user info on header
    
    * feat(DEV-1045): add translations
    
    * chore: remove console.log
    
    * feat(DEV-1045): add dev portal user type
    
    * feat(DEV-1045): add missing fields to type
    
    * feat(DEV-1045): update texts
    
    * feat(DEV-1045): update texts
    
    * feat(DEV-1045): update header content height
    
    * feat(DEV-1045): update switch cases
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>

[33mcommit 71fcacb7c423df044695191295142db092da65a2[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Nov 16 12:07:42 2023 +0100

    [DEV-1024] Add post confirmation confirm sign up message template (#387)

[33mcommit 81fbd912f437a6dfa7984825d0b1b68fa424eeae[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Nov 16 11:52:47 2023 +0100

    [DEV-1056] Add e-mail template for confirmation message (#380)

[33mcommit 635705dc18edf3567fc587a9fb04a87864dc9d1d[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Nov 16 11:41:55 2023 +0100

    [DEV-1121] - Custom esbuild configuration (#400)

[33mcommit c9752007b2937da05e497d3e766493e3881985e7[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Nov 15 17:30:40 2023 +0100

    [DEV-1118] Enable on cognito the custom auth for mfa (#398)

[33mcommit 64b2d040dfb59fd2b050319fedd6ae0afc64632b[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Nov 15 16:36:52 2023 +0100

    [DEV-1083] Add sticky scrollable guide menu (#384)
    
    * add sticky scrollable guide menu
    
    * fixes after code review
    
    * fixes after code review
    
    * improve scrollbar gutter style
    
    * replace scrollbarGutter prop with width prop
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 7fb20a54198504ff86a4facf3989755743f8e368[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Wed Nov 15 15:42:20 2023 +0100

    [DEV-1098] Privacy policy blank page on android (#392)
    
    * update script injecting mode
    
    * update injecting mode
    
    ---------
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit e6a44382ae9d0daae0c02739b4c0ce8277eae694[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Nov 15 15:34:05 2023 +0100

    [DEV-1106] Fix mail to continuing to open (#396)
    
    * [DEV-1106] Fix mail to continuing to open
    
    * Remove unused imports
    
    ---------
    
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit 3014d6bb566b42da75ac2a160089663af7d4a372[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed Nov 15 13:32:58 2023 +0100

    [DEV-1067 DEV-1072] webinar detail page (#363)

[33mcommit 0ed20dc8e35267cf887f1bb235cabc1e0c0bc123[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Nov 15 13:01:53 2023 +0100

    Remove useless attach_policy_statements (#397)

[33mcommit 8fc6790fcfade7db0375f77933a273b42c52819c[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Nov 15 12:40:01 2023 +0100

    [DEV-1091] Add create auth challenge handler (#393)

[33mcommit bd611297be691c07bd9535c8b21fcefb1bb6aef8[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Nov 15 11:50:24 2023 +0100

    Add verify auth challenge handler (#395)

[33mcommit 67396653edd59e0abca2668161f7700b5bf6a7d8[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Nov 15 11:35:15 2023 +0100

    [DEV-1092] Add define auth challenge handler (#389)

[33mcommit 4daf36cdbd5b19c4ba31045b026c53897a0daed3[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Nov 15 11:08:21 2023 +0100

    [DEV-1087] Fix wrong tabs grouping (#382)

[33mcommit 011931c2681b4231fec98e62a6cf617b2694fafe[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Nov 15 10:24:32 2023 +0100

    [DPC-72] update version "Guida Tecnica" (#391)

[33mcommit 3547c3d9f7a4e537eb6b609a73b23dd76e629851[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Nov 15 09:31:40 2023 +0100

    [DPC-69] change link to yaml (#390)

[33mcommit 6902367784e303ba61c2be7c3e7c191ff4bd58a3[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Nov 14 10:10:57 2023 +0100

    [DPC-96] UPDATE docs (#386)

[33mcommit f7e35f1b2610d1764cf375ea1346b7a12988b243[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Nov 13 16:29:34 2023 +0100

    Return PageNotFound on prod environment (#385)

[33mcommit ed6d4f789f05bf022f8e4586dd76f705fe5711eb[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Mon Nov 13 16:10:06 2023 +0100

    [DEV-896]:  Sign up page (#345)

[33mcommit 78542f21adca2c18613f06d1115fc4adb5ee3d64[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Fri Nov 10 10:21:21 2023 +0100

    [DEV-1088] Fix wrong mailto link (#371)

[33mcommit cd429a13dac43640ae9f11f136c8b129f9a36858[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Nov 10 09:09:32 2023 +0100

    [DPC-86] Update Tutorial contents (#379)

[33mcommit 42a7131ff2a433fe57f9c3db81c69e0739df3b66[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Nov 9 09:13:24 2023 +0100

    [DEV-1102] - Handle CustomMessage_ResendCode trigger (#378)

[33mcommit 3e9492efab557b3eb234c9ced1f80464c63dcfbe[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Nov 8 17:11:00 2023 +0100

    [DPC-93]Update subtitle (#377)

[33mcommit 250eeaf63491a35642c07728815239083569d9c5[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed Nov 8 16:27:35 2023 +0100

    [DEV-1062] Add confirmation page (#360)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 31c8353a583ea0be0ed130e71163909956d45f41[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Nov 8 15:42:39 2023 +0100

    [DEV-1064 DEV-1050] Fix guide menu nested style (#370)

[33mcommit a2fde778090775469f519a86ed86f5fc9d468542[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Wed Nov 8 15:28:17 2023 +0100

    [DEV-897]: login page (#350)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 82ca9b03864fa9751075792fb783329c63a15acc[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Nov 8 14:59:04 2023 +0100

    Fix start command for nextjs-website (#376)

[33mcommit 0aa595e3ded03ec16cf79238307d0bb5858ff322[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Nov 8 14:26:40 2023 +0100

    [DEV-1066] Webinars section (#359)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit ce27a7d0485317d3557918add9fb9602d0df4c49[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Nov 8 11:15:01 2023 +0100

    [DEV-1043] - Add missing sign up parameters to user pool (#374)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 705bd2d5be421980630caae0e973abe789eb5aff[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Nov 8 11:04:56 2023 +0100

    [DPC-85] Update gitbook docs (#375)

[33mcommit 74818bc4677b7549727ab3540be9feb85244c745[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Nov 8 10:07:28 2023 +0100

    [DEV-1048] Add AccountActivated page (#372)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 68c4f3583f3e0e072d52d6702a5e1934aff492ff[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Nov 8 09:21:30 2023 +0100

    [DPC-91] Update version "Approfondimenti sull’integrazione" SEND (#373)
    
    * [DPC-91] Update version "Approfondimenti sull’integrazione" SEND
    * [DPC-91] Add  version 2.1 for "Approfondimenti sull’integrazione"

[33mcommit 7ba6c16bea58f64123ab492320fa9b42624ca528[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Nov 7 17:38:43 2023 +0100

    [DEV-1066] Add webinar and speaker types (#358)

[33mcommit cd3384b63cbc087436346ff1a5397adf7757c397[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Nov 7 13:18:42 2023 +0100

    [DEV-1057] - Send welcome email when user confirms email address (#361)

[33mcommit 2095bd9a026bb3db9cbe5b47c206e2c82c63df19[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon Nov 6 10:30:22 2023 +0100

    [DPC-81] Update support link (#365)

[33mcommit 47aeabb8dc711d50329f07c2eb2561634e89230f[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Tue Oct 31 18:43:37 2023 +0100

    [DEV-1058] Next intl setup (#320)

[33mcommit 46859b348380685210b9020ee115ae3144a2f17f[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Oct 31 17:26:58 2023 +0100

    [DEV-1023] Change email verification mode from code to link (#347)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 046d4aaaa49809ffccd8b7f21f7f0ec5d4551b57[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Tue Oct 31 16:18:44 2023 +0100

    [DEV-828] Cookies prefences footer link (#333)

[33mcommit a82f38c56f28fd39c4c6867a901e53cbb2852a39[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Oct 31 14:50:14 2023 +0100

    [DEV-899] Update Commit Sync Manuals (#354)

[33mcommit 1f378970e3a9eff87210ae52912641c5728e610f[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Oct 27 14:47:09 2023 +0200

    [DEV-879] Preserve spaces during token processing (#343)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit f0122db8c18a892b15bac28e4f75ae8b36892dee[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Oct 26 15:05:55 2023 +0200

    [DPC-69] Update link API (#346)

[33mcommit c48a7d696a1447ab57b768c1de7549ccf58cd5a6[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Oct 26 10:42:35 2023 +0200

    Update user pool's password policy (#344)

[33mcommit a77bf31eb71e2e00c022a24b19acd9709fbb3297[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Oct 20 10:25:51 2023 +0200

    [DEV-977] Fix rendering layout of Embed gitBook block and add custom components… (#315)
    
    * Fix rendering layout of these gitBook blocks:
    
    - codeBlock
    - expandable
    - hint
    - quote
    - table
    - tabs
    
    * Fix inactive Tab border
    
    * Fixes after code review
    
    * Update apps/nextjs-website/src/components/organisms/GitBookContent/components/CodeBlock.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Fixes after code review
    
    * Fixes asSeverity input type after code review
    
    * Fix rendering layout of Embed gitBook block and add custom components to render a link with page info and Figma or CodePen's iframes
    
    * Add children prop to EmbedCodePen.tsx and EmbedPageInfo.tsx
    
    * Fix favicon URL in EmbedPageInfo component
    
    * Fix absolute favicon URL in EmbedPageInfo component
    
    * Add EmbedCaption component
    
    * Add EmbedYouTube component
    
    * Use EmbedCaption and EmbedYouTube
    
    * Add margin bottom to Hint component
    
    * Add EmbedLink component as default
    
    * Set iframes border as invisible
    
    * Fix copiedTooltip translation
    
    * Fix Cards gitbook block layout
    
    * Fix Expandable gitbook block layout
    
    * Fix hash link gitbook block layout
    
    * Fix Table gitbook block font size
    
    * Set showLineNumbers default to true in CodeBlockPart component and remove unwanted falsy values in gitbook code schema
    
    * Add "should replace the title of link to an anchor with a human readable text" to parseContent's tests
    
    * Add @figma/embed management
    
    * Fix empty titles bug by parsing all kind of blocks inside title lines
    
    * Fix CodeBlockPart.tsx language property type
    
    * Fix constant name in packages/gitbook-docs/src/markdoc/schema/link.ts
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * Add test to cover missing lineNumbers attribute case in code block
    
    * Refactor Embed component by:
    
    - removing the EmbedPageInfo component
    - moving the logic relative to which component render on the basis of the URL, into the function selectEmbedType in a dedicated helper
    - test selectEmbedType function
    
    * Fix selectEmbedType function
    
    * Remove useless constant
    
    * Add "should parse @figma/embed" test
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit f45e3add6a4e01efcf41c56cabc97f903f402ab1[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Oct 19 19:06:37 2023 +0200

    Set button variant to 'outlined' in ProductShowcase component (#340)

[33mcommit ab1c7fadc153080bff1575d91a6f81b6876d44bc[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Oct 19 18:51:15 2023 +0200

    [DEV-791] Fix overview postIntegration layout (#332)

[33mcommit 4ce16666fb97956dd8b17e03b4d5eb7b06811291[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Oct 19 18:40:06 2023 +0200

    Fix overview's startInfo layout (#328)

[33mcommit c685cfbb504f2f3eafbded3c5ae1e899c45971d0[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Oct 19 17:03:52 2023 +0200

    Add Cognito to connect-src in CSP (#339)

[33mcommit 75f853ebb7cc6919426448adf8e6b0579e4b1aa7[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Oct 19 16:05:05 2023 +0200

    Fix environment variables (#337)

[33mcommit cd4b8f9ec5fd22e2e5571481451706334a35d434[m
Author: Jeremy Gordillo <jere.gordi@gmail.com>
Date:   Thu Oct 19 15:42:23 2023 +0200

    [DEV-943, DEV-992] Authentication flow (#309)
    
    Co-authored-by: tommaso1 <tommasorosso1@gmail.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 4b90f518accfbff81321e3ca0aad76e2395cb77b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Oct 19 14:38:02 2023 +0200

    [DEV-1007] - Send registration email using custom SES (#330)

[33mcommit 1340652efd0a1a3613d81eeb8155ae41ed2f07c2[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Oct 19 11:17:40 2023 +0200

    [DEV-1013] - Create DNS records to verify domain for SES (#334)

[33mcommit 60c52910325774e733d36f9d7fe6524c0c0a2e89[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Oct 19 11:13:32 2023 +0200

    Update content security policy (#335)

[33mcommit 4e2b12343ba4809532ca0dee3cd7c3172a5f7d74[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Oct 18 18:00:24 2023 +0200

    [DEV-1006] - Configure SES (#295)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit bc15f2b54391a3c6b02f4b5df5465b9ade3449b7[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Oct 18 16:21:19 2023 +0200

    [DPC-70] Update version Knowledge-base di SEND (#331)

[33mcommit b7d576e14cade983578ec9f449804312c000431d[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Oct 18 10:16:58 2023 +0200

    [DPC-66] Upload new manuals for pagopa (#325)

[33mcommit a01d7bdde68c630e1b6b1dd9f6ac8cdac061396b[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Oct 18 09:38:28 2023 +0200

    [DPC-73] link typo (#329)

[33mcommit d0112d5a66e106271f35268b082e0f7354967884[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Oct 17 18:34:32 2023 +0200

    [DPC-69] API Send Update (#323)
    
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 48ea6a94590961d3532ced5cfb90e7ab13b7d21e[m
Author: Fabrizio Ulisse <fabrizio.ulisse@gmail.com>
Date:   Tue Oct 17 18:21:24 2023 +0200

    [DEV-904] Uncomment Carta Giovani in guides.ts (#324)
    
    
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 21067267906a8bb24e37defb158ebf5f199e1005[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Oct 17 17:53:21 2023 +0200

    [DPC-72] Update manuals IO App (#322)

[33mcommit 23e4942dcbf000dbfef0d096045ae8e3793cddb0[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Oct 17 15:55:52 2023 +0200

    [DEV-792] Rendering gitbook blocks (#307)
    
    * Fix rendering layout of these gitBook blocks:
    
    - codeBlock
    - expandable
    - hint
    - quote
    - table
    - tabs
    
    * Fix inactive Tab border
    
    * Fixes after code review
    
    * Update apps/nextjs-website/src/components/organisms/GitBookContent/components/CodeBlock.tsx
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    
    * Fixes after code review
    
    * Fixes asSeverity input type after code review
    
    * Add margin bottom to Hint component
    
    * Fix copiedTooltip translation
    
    * Fix Cards gitbook block layout
    
    * Fix Expandable gitbook block layout
    
    * Fix hash link gitbook block layout
    
    * Fix Table gitbook block font size
    
    * Set showLineNumbers default to true in CodeBlockPart component and remove unwanted falsy values in gitbook code schema
    
    * Add "should replace the title of link to an anchor with a human readable text" to parseContent's tests
    
    * Fix empty titles bug by parsing all kind of blocks inside title lines
    
    * Fix CodeBlockPart.tsx language property type
    
    * Fix constant name in packages/gitbook-docs/src/markdoc/schema/link.ts
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    
    * Add test to cover missing lineNumbers attribute case in code block
    
    ---------
    
    Co-authored-by: Marco Ponchia <ponchia.marco1994@gmail.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit bfa279ffeab9cfeb4c1bd2e582778abc3151c2dd[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Oct 13 17:22:23 2023 +0200

    [DEV-852] Menu item should be active if subpath is included in path (#317)

[33mcommit 2636b4f8cd7fccfc16df1f1a4ae137b9e800dd49[m
Author: MikeAtUqido <146933303+MikeAtUqido@users.noreply.github.com>
Date:   Fri Oct 13 16:27:57 2023 +0200

    feat(DEV-788): change menu dropdown items color (#319)
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>

[33mcommit 2f741bf2847620da3ac1eb78a5836d4f6f702a79[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Oct 13 14:46:43 2023 +0200

    [DEV-953] Refactor layout (#280)
    
    * add app structure, migrate components to clinet, removed theme client problematic items
    
    * white color
    
    * update next and next-config
    
    * Fix mui theme for new nextjs version
    
    Co-authored-by: tommaso1 <tommaso1@users.noreply.github.com>
    
    * fix linting
    
    * migrate static paths
    
    * fix linting problems
    
    * fix package json
    
    * Apply suggestions from code review
    
    * privacy policy
    
    * removed page props
    
    * linter
    
    * terms of service
    
    * api page
    
    * guides page
    
    * fix types
    
    * remove  unused comment
    
    * Fix api and 404
    
    * improve icon import
    
    * refactor icon wrapper
    
    * Move editorial-components into dev-portal
    
    * Fix linting
    
    * Fixes after merge with main branch:
    
    - move guideMenu container boxes inside the component (use client directive is needed)
    - fix getTutorial and getGuide api functions
    - remove pages folder
    - upgrade editorial-components dependency
    
    * Fix properties of undefined error
    
    * refactor tutorial data fetching
    
    * refactor guide page app structure
    
    * Fix favicon.svg error
    
    * Fix regex exit guard
    
    * Fix layout issues after migration from pages to app routing
    
    * Fix linting
    
    * Set guideMenu position to sticky
    
    * Fix get static params fetch
    
    * Remove _blank target from external links
    
    * Fix build issue
    
    * Fix build issue for readme with space in file name
    
    * Expose target prop in RelatedLinks component
    
    * remove console log
    
    * remove comment
    
    * test module issue
    
    * refactor styles modules
    
    * remove css modules
    
    * [DEV-936] Layout fixes after the refactor of the app structure (#260)
    
    * Fix layout issues after migration from pages to app routing
    
    * Fix linting
    
    * Set guideMenu position to sticky
    
    * Remove _blank target from external links
    
    * Expose target prop in RelatedLinks component
    
    * remove comment
    
    * test module issue
    
    * refactor styles modules
    
    * remove css modules
    
    ---------
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>
    
    * Add decision documentation about adopting App Router
    
    * Fix document 0006
    
    * [DEV-820] Refactor app structure remove editorial components (#250)
    
    * Move editorial-components into dev-portal
    
    * Fix linting
    
    * Fix layout issues after migration from pages to app routing
    
    * Fix linting
    
    * Set guideMenu position to sticky
    
    * Remove _blank target from external links
    
    * Expose target prop in RelatedLinks component
    
    * remove comment
    
    * test module issue
    
    * refactor styles modules
    
    * remove css modules
    
    ---------
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>
    
    * Fix document 0006
    
    * refactor layout
    
    * update pages
    
    * use anchor instead of Link (#271)
    
    * Fix favicon issue (#272)
    
    * remove products and rename ProductLayout
    
    * add main wrapper
    
    * Fix page with js scripts
    
    * Update apps/nextjs-website/src/app/[productSlug]/api/page.tsx
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * Update apps/nextjs-website/src/app/[productSlug]/guides/[...productGuidePage]/page.tsx
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * Remove commented imports in layout.tsx
    
    * Align node versions
    
    * Add io-ts package
    
    * Remove hardcoded color
    
    * Fix ThemeRegistry.tsx prop types
    
    * Update ThemeRegistry.tsx
    
    remove no explict any
    
    * Remove spaces from paths in parseDoc's transformPath function and remove file renaming from bash script
    
    * Fix ToS and Privacy policy mobile layout and transform to async api's function manageUndefinedAndAddProduct
    
    * [DEV-940] Sticky headers (#312)
    
    * Fix sticky headers behaviour and menu visibility in guide pages
    
    * fix scroll up behaviour
    
    ---------
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>
    
    * Apply suggestions from code review
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    
    * Move site header height const
    
    ---------
    
    Co-authored-by: redtom <tommasorosso1gmail.com>
    Co-authored-by: tommaso1 <tommaso1@users.noreply.github.com>
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 77b63aad180672be8b6971db2d528222a7f9ad23[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Oct 12 09:14:03 2023 +0200

    Add How To add a new guide (#316)

[33mcommit 365039563d4783947f58d3068906e93b7c0e6b34[m
Author: Carlo Alberto Degli Atti <lordkada@gmail.com>
Date:   Thu Oct 5 15:32:38 2023 +0200

    Fix Modello 321 as Modello 231 shown in the footer (#313)
    
    Co-authored-by: Carlo Alberto Degli Atti <lordkada@users.noreply.github.com>

[33mcommit 26034ed518b17c183180cdae1aac7bc5fb58c7fe[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Oct 5 13:14:05 2023 +0200

    [DPC-63] Update quick start (#311)

[33mcommit b90e1a1d3824c7cfdbb997144ec649548fbe0c08[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Oct 5 10:03:51 2023 +0200

    [DEV-941] - Add "how to" and ADR (#293)

[33mcommit 4e46e7eceb39d59811d4c95467a3fc00aabb27b9[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Thu Oct 5 09:45:28 2023 +0200

    [DPC-63] update quick start Firma con IO (#308)

[33mcommit 884d1f4001c165c1a867a91b7800e96395f703b8[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Oct 4 16:17:33 2023 +0200

    [DEV-975] - Use shell syntax to read environment variables (#304)

[33mcommit c16ecf0a8d94628e7c7b804fadb3390238fa98a5[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Oct 4 13:14:58 2023 +0200

    [DPC-65] SEND update openapi url (#306)

[33mcommit 8de81ba82c21afee1176cd529515d8e8114cd74f[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed Oct 4 12:52:36 2023 +0200

    add hash router to elements (#303)
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>

[33mcommit c807b965adbc4725ab326a5afc06c7c06819b9cc[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Oct 4 11:00:32 2023 +0200

    [DPC-64] rest calls format standardization (#305)

[33mcommit 2155a8aacadf0cfb88448b8910e60e1675faf484[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Oct 4 09:56:04 2023 +0200

    [DEV-969] Create AWS Cognito resources (#297)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 1c58e63549d5e97646cd134ace6a42637ca91090[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Oct 3 17:07:05 2023 +0200

    [DPC-63] Update quick start contents (#302)

[33mcommit 21f34ad709645d366512d247678b7a686f3d76f3[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Oct 3 11:59:20 2023 +0200

    [DPC-60] change in curl string (#294)

[33mcommit b836fd31faef786f2acde974bc17e27e8d8882ac[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Oct 3 10:23:06 2023 +0200

    Iterate to add DNS record (#300)

[33mcommit 92016c7d602d3e580f045c0b26f7e9f9cc4977bc[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Oct 3 09:43:38 2023 +0200

    Create TLS certificate for auth.developer.pagopa.it (#296)

[33mcommit 2cb72b5c6c7fa3d2ec55a81ca8da3c17f83b56c2[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Sep 29 14:32:20 2023 +0200

    [DEV-963] Fix terraform fmt command and lint terraform files (#292)

[33mcommit 0b73b2b93f343bf021bce1396f89b932ec4d6ee1[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Fri Sep 29 12:58:00 2023 +0200

    [DEV-942] update sync manual (#291)

[33mcommit 4da0a62d3f3f557d7a895f053357d810f49d0458[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Sep 28 18:37:15 2023 +0200

    [DEV-851] Fix cookie banner font (#287)

[33mcommit 98e73cdcd7480976e4332d5f9439d04810360c8c[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Sep 28 18:27:47 2023 +0200

    Fix headers and paragraph readability (#288)

[33mcommit bf71f07ce3849d6cb77f4a86c1c5465a288be1a2[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Sep 28 17:56:51 2023 +0200

    [DEV-771] Add horizontal scroll to mobile layout (#286)

[33mcommit e20400cd4b7db50107496ad44052c3c11a9c18b1[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Sep 28 17:50:46 2023 +0200

    Update path after migration to app router (#290)

[33mcommit d28ec6d47584500d7a3d5a8edfa840c53f514c7b[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Sep 28 17:43:19 2023 +0200

    Replace manuale operativo image (#281)

[33mcommit 9d0d7b5096f2bb8f3fda16485e8acf96a4757e3f[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Thu Sep 28 17:12:56 2023 +0200

    [DEV-875] - Refactor app structure (#240)

[33mcommit ef970a89b963403dcf7fccee94498464e19e8333[m
Author: Carlo Alberto Degli Atti <lordkada@gmail.com>
Date:   Thu Sep 28 16:49:08 2023 +0200

    Fix the missing mobile image for the guida-tecnica-sugli-avvisi-di-pagamento (#289)
    
    Co-authored-by: Carlo Alberto Degli Atti <lordkada@users.noreply.github.com>

[33mcommit 18f2136bc2854a974a8c70282c6ef5b13aeba227[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Sep 28 14:30:06 2023 +0200

    [DEV-914] - Add strapi-cms module to apps (#259)

[33mcommit 081aaffd15358e146ab8022cb5c2db8d9238713c[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Sep 27 17:33:38 2023 +0200

    Change max size (#284)

[33mcommit 6dbf04a83fd790e8083d5c8ef98cc471ee3786fc[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Sep 27 16:46:57 2023 +0200

    [DEV-952] Add eslint strong and recommended config (#282)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 71cb20d5d325f2f3de2c52b173bde105794134e2[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Sep 26 12:54:59 2023 +0200

    [DPC-58] update hash docs (#279)

[33mcommit 2a123c90ceaf5fc63dce378c5bcd6cac84dd0240[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Sep 26 11:36:24 2023 +0200

    [DEV-947] Update version modello-integrazione (#278)

[33mcommit 8acfc7ed2026410b6f5affff47b13003a662fea0[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Sep 25 17:30:10 2023 +0200

    [DEV-946] Contents update - Link update (#277)

[33mcommit 9b1c7d930f6964e4e902e69ae8ba36ddb2965717[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Mon Sep 25 14:21:14 2023 +0200

    [DEV-942] docs hash update (#276)

[33mcommit 866ba2bf2686e9bb85762122425f00fcf6074e40[m
Author: Fabrizio Ulisse <fabrizio.ulisse@gmail.com>
Date:   Fri Sep 22 16:39:23 2023 +0200

    Update IO-sign overview copy (#270)

[33mcommit fc0afc8c6e4dfcb526491df7e42d947548c45f61[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Sep 22 09:33:27 2023 +0200

    [DEV-881] Set SiteHeader as sticky and manage its visibility on scroll event (#264)
    
    * Set SiteHeader as sticky and manage its visibility on scroll event
    
    * Fixes after review

[33mcommit e5fc50da5656fb05ecc3d4129daa984f2756ad02[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Sep 21 16:45:45 2023 +0200

    [DEV-937] Upgrade AWS provider (#267)

[33mcommit 6537bad1eeba45a66390912b81d6cca5ca79bd8a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Sep 21 16:30:43 2023 +0200

    [DEV-877] Upgrade Terraform version (#265)

[33mcommit 2cae6adf97f988d69fffa571bbf93bb6ff195117[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Thu Sep 21 16:25:12 2023 +0200

    Fix "Go to GitHub" link style in ApiSection component (#263)

[33mcommit 5db5cbafc672a9f49fc4a01f9a6df02c557d06a3[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Wed Sep 20 14:48:12 2023 +0200

    Update "Self Care" in "Area Riservata" (#261)

[33mcommit bb688ff0ceda10af82a0a914806f439fad948c21[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Sep 19 10:54:13 2023 +0200

    Update CODEOWNERS (#255)

[33mcommit 942c8892fe3a59fbf950ba7cff2ed1aa49d09a27[m
Author: Monica Costantini <122867940+certevol@users.noreply.github.com>
Date:   Tue Sep 19 10:23:06 2023 +0200

    [DEV-932] - Replace href Link- Selfcare (#258)

[33mcommit 65232386b765042e68817061d2c499e88138b2bb[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Sep 18 15:45:45 2023 +0200

    [DEV-738] - Add different links to Send API using 'spec' query param (#257)

[33mcommit d59b4097d13e8cd92dfb666f9d58e5a18ce89c5d[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Thu Sep 14 08:50:53 2023 +0200

    [DEV-737] - Guide api url (#218)

[33mcommit d99de0bafbfa337749fbaf6d3496f63903b17f01[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Sep 13 12:55:57 2023 +0200

    Add pagoPa quick start links to home page and to pagoPA overview (#256)

[33mcommit e2a1cd4bc04bf8070555399957e9c6ad80cba0f1[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Sep 12 16:23:44 2023 +0200

    [DEV-906] - Add links with proper style to BannerLinks component (#251)

[33mcommit 2ea97014c6310722cf2b9275be43fc7993b0ac28[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Sep 11 17:23:09 2023 +0200

    Remove break-all from quick-start paragraphs (#252)

[33mcommit 7e0aa1886196103fe290c3f8a0d5ee8b50ad79df[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Sep 11 17:12:53 2023 +0200

    Verify PR has a link to Jira activity (#254)

[33mcommit 30b15bba0e04c2f0d48b589476e1261627799396[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Sep 11 16:59:47 2023 +0200

    Verify branch is up to date when opening a PR (#253)

[33mcommit 426582a62118f5ddc8590810c4652e9ca6b45a78[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Sep 5 18:02:32 2023 +0200

    [DEV-880] - Make guides and manual menu sticky (#248)

[33mcommit 6326a9e99b42bdcae442eaf5a960f18dbb67bbb9[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Sep 5 17:50:53 2023 +0200

    [DEV-795] Parse link between different space (#247)
    
    Co-authored-by: AF <alessandro.ferlin@pagopa.it>

[33mcommit 2e4189256cdc695bcb52ec2d6a0cae87821b63c8[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Mon Sep 4 17:19:45 2023 +0200

    [DEV-757] - Improve guides and manuals menu (#246)

[33mcommit 725076537010695af46793d34dd951c0de881148[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Aug 31 09:50:10 2023 +0200

    [DEV-753] - add pago pa quick start page (#245)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 1354051230e680e9689a5cf5c955131cfe2f0a4b[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Aug 30 17:09:30 2023 +0200

    Update README.md (#244)
    
    Remove old README section

[33mcommit ca392f3af0acee1977c7e3130c2c871d5162106d[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Aug 30 15:02:40 2023 +0200

    Set date property as optional in Newsroom (#243)

[33mcommit 629c367760ef8909b425cd1b0f46e665e497e8ea[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Aug 30 14:42:06 2023 +0200

    Change the url rewrite conditions (#242)

[33mcommit 696a70b07d83e796e0457246a8a06e2846898b12[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Aug 30 14:29:19 2023 +0200

    Fix Image layout by removing unwanted padding (#241)

[33mcommit 2919f206cf84c60a0beea3c3152d4dd530919d1a[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Aug 30 11:51:43 2023 +0200

    [DEV-819] - In-page menu in each guide (#230)

[33mcommit fb99d203bddeba4bfd2e03f6a1f3a8b01941eec8[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Aug 30 08:32:57 2023 +0200

    [DEV-844] - Parse mention (#237)

[33mcommit 61576fe14bdc7fa5ae97b7f1829a04afbbf74b0e[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Aug 10 15:22:44 2023 +0200

    Remove CI badge from README (#239)

[33mcommit 39fb5e0a67ea84e610d4c361639d48d878e3404f[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Aug 10 15:14:15 2023 +0200

    [DEV-755] - Io sign add quick start page (#234)

[33mcommit 698d2c19ee35cfa32e7baeafed62288cf37c4081[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Aug 10 15:02:53 2023 +0200

    Remove legacy and unused packages (#238)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 3babc2212f14ff5dbeccba30699c4f964fefea45[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Aug 10 12:25:50 2023 +0200

    DEV-796 Parse and render html table card as card (#232)

[33mcommit f418ff91dc11eea7e82c6990716bdc8bd5170d95[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Aug 10 09:53:39 2023 +0200

    [DEV-754] - Send/add quick start page (#216)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit d66dae72d9d4454edd05d9765e2979cfb632cc80[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Aug 8 17:37:38 2023 +0200

    [DEV-823, DEV-843] - NextJS analyze bundle size with GitHub Action (#223)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 0b4500420e9b6046b0e11c572f4e3050fe408a1a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Aug 8 16:30:04 2023 +0200

    Decrease time to set PR as stale (#236)

[33mcommit 957364062cb4feceb5072e0345669433aeeba90b[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Tue Aug 8 08:21:19 2023 +0200

    [DEV-751] - Fix mobile style for tutorial and guide pages (#233)

[33mcommit 958563416c2a7ffc03a39c1e643d7b99299139fe[m
Author: Jessica Corrias <corrias.jessica93@gmail.com>
Date:   Thu Aug 3 11:56:50 2023 +0200

    [DEV-716]: Fix API SEND (#174)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit a9deddd3045469c1bcc0a3ce292e19b628600d48[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Aug 3 09:04:28 2023 +0200

    DEV-833 Render gitbook page components (#205)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 8a71b899173bbfcf26686ebc477a7ebc4069b1d8[m
Author: tommaso1 <tommasorosso1@gmail.com>
Date:   Wed Aug 2 17:48:56 2023 +0200

    upgrade turbo (#228)

[33mcommit 40d2869fc3db8628ed9b238849b381cf40fee08c[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Aug 1 15:58:57 2023 +0200

    Add quick-start page (#183)
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit f2a300558fd3d55a798e43f100c7b25e0764abd5[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 31 16:16:48 2023 +0200

    Add PNRR link to footer (#220)

[33mcommit 00abbbbf5926512ecaf686c6b120a4600db39fc5[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 31 15:59:48 2023 +0200

    Revert "Fix expandable images rendering (#219)" (#221)
    
    This reverts commit a45618bc9ea4629be4b1aa406e1d928b3ef1059a.

[33mcommit a45618bc9ea4629be4b1aa406e1d928b3ef1059a[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Jul 31 14:54:33 2023 +0200

    Fix expandable images rendering (#219)

[33mcommit 41d48ffd73eb064ffc0a0f2fd59c65831febfac2[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 28 08:52:08 2023 +0200

    Add https://\*.cookielaw.org/logos/ to img-src in CSP (#208)

[33mcommit 98213d25ef946c13c017b4f7214f665d8ebf3f8d[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jul 27 18:18:47 2023 +0200

    [DEV-747] - Add cookie script (#179)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 04b22fb1a15a1ac58536b05fc17a889360abf4a3[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 26 10:21:54 2023 +0200

    Add arcade URL to CSP (#204)

[33mcommit 69c10e2e88436ffdc41155a9711747168d2a801a[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Jul 25 15:27:24 2023 +0200

    Add description parser (#202)

[33mcommit 11985fcc66fc90a3bd33b7985a8c3f748e93b081[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Jul 25 12:15:26 2023 +0200

    DEV-821 Parse the title of each gitbook page (#201)

[33mcommit 3eca94058a4433f5ba9ac2a233133b36ca1922b3[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Jul 24 16:34:54 2023 +0200

    DEV-766 Fix links within a guide (#198)

[33mcommit b804c05f231e5732c9875092b29b714811023763[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Jul 24 16:13:42 2023 +0200

    Add table parser (#200)

[33mcommit 2c26c456027f256240e042f18fee1713dcdad14f[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Jul 24 12:21:52 2023 +0200

    DEV-807 Add expandable parser (#199)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 8408fd13d7b40df032c1f68100718e5c437f14bb[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 24 11:23:52 2023 +0200

    [DEV-804] - Add GitBook embed parsing (#196)

[33mcommit eb3f0f51b33a3cc739e2f4e21a814693be384e60[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 21 14:42:31 2023 +0200

    [DEV-806] - Add GitBook tabs and tab parsing (#197)

[33mcommit fae732141644fcb3facd6ec4cbebb095550d82ed[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jul 21 11:15:32 2023 +0200

    DEV-803 GitBook file parser (#191)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit d167777233fe094d5aeaf356de4f4b503d3c8888[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 21 10:27:58 2023 +0200

    [DEV-801] - Add GitBook quote block parsing (#190)

[33mcommit 706666b0ce5bc93eb10276fae60a91ae4415a8ed[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jul 21 10:07:42 2023 +0200

    DEV-797 Parse image in the same way as figure (#194)

[33mcommit b51861195d4835b1a6e500c693b30837786ed6c7[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jul 21 09:55:26 2023 +0200

    Parse styled text (#192)

[33mcommit 2a0fd37c3d144501552cc339803942f0e07ea12b[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jul 21 09:42:00 2023 +0200

    Ignore any <p> tag (#195)

[33mcommit f00b4f1d93c87ca84c51d75e5edc9727c9da4ef1[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jul 20 16:55:06 2023 +0200

    Fix gitbook title render (#186)

[33mcommit 4fce88abeafc84da998e2c87eb20e7c18364c8c2[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jul 20 16:17:57 2023 +0200

    [DEV-717] - Fix overview spacing (#193)

[33mcommit 373712cc3daa412e131792231cfa0090446eae1c[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jul 20 10:10:21 2023 +0200

    Add gitbook list parsing (#188)

[33mcommit 22e28763728ba262e7e6c36ef8644604274fe31f[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jul 20 09:25:42 2023 +0200

    DEV-802 Add GitBook code block parsing (#189)
    
    Co-authored-by: AF <alessandro.ferlin@pagopa.it>

[33mcommit 681a70ebc7eba4becb69ceb2070877b57c0993c2[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jul 19 12:43:28 2023 +0200

    Add missing components to implement (#187)

[33mcommit e642d7ca241baa6e2a6d51a5e0deac182a04b64f[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jul 19 11:43:54 2023 +0200

    DEV-555 Add gitbook page parsing (#185)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 3962f9b2ba05fc9155da13abaaa1f13605a093d8[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Jul 18 09:55:35 2023 +0200

    DEV-780 Improve GitBook Menu (#178)

[33mcommit 6d2b9399207b973e395443abd756fd04cde7ec71[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 17 12:47:48 2023 +0200

    Fix copy on tutorial index pages (#184)

[33mcommit 963f7dc490ccc6555c8ded77646f1c6446799197[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jul 13 15:28:09 2023 +0200

    Add NextJS build cache (#171)

[33mcommit 390b2ee8d9d9f27eb7670794d3b114f4a7c19497[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jul 13 09:33:16 2023 +0200

    Automatic deploy on prod (#163)

[33mcommit 124ba2bb43d01b1fba7ad8bc2629f41e63610e49[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jul 13 09:22:54 2023 +0200

    Remove Next export using next build command (#177)

[33mcommit 837edef935bec15a99ee982e8f89993536e47e6d[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 12 17:04:56 2023 +0200

    Pass icon to ButtonNaked (#175)

[33mcommit 43591aac76564b89d02b6fb0cf250ce824bf8314[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 12 15:37:03 2023 +0200

    Disable Next telemetry tracking (#172)

[33mcommit 68bc7cd68c93a4871e838bfbb4db2fc133c83851[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Jul 12 14:59:56 2023 +0200

    [DEV-735] Fix Abstract default height and padding (#170)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit c0314117b8cdb61295a13f68e736fb39f77fc56d[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 12 10:40:22 2023 +0200

    Add Matomo to connect-src in CSP (#168)

[33mcommit 1df5b027bea8837fc12260bb898494a8592df3a2[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 12 10:27:03 2023 +0200

    Allow execution of matomo script (#167)

[33mcommit 74a6e711115c2c4f615ba11171e017b8ed427101[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jul 12 09:39:10 2023 +0200

    Update gitbook docs (#165)

[33mcommit 2f81dd2484446112c335c2be4da2ed7e72d3db1a[m
Author: Jessica Corrias <corrias.jessica93@gmail.com>
Date:   Tue Jul 11 09:23:54 2023 +0200

    [DEV-655]: add matomo analytics (#141)

[33mcommit 004e6de3eb3d7bddfe0cfee3212aeb38e7b6e7bc[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 10 16:49:24 2023 +0200

    Remove link from footer (#164)

[33mcommit 8a7f9374485de66765dd0e6a6f7bc8395ba8456e[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Jul 10 10:26:42 2023 +0200

    Add favicon (#162)

[33mcommit 797d8ced0a4cbe319b52844bf1298bf36beb1bd5[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jul 7 18:34:21 2023 +0200

    DEV-743 Add terms of service (#160)
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>

[33mcommit f34b51b51648187c9477a0ef123a8e4a4deec203[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 7 18:33:24 2023 +0200

    Add URL to CSP (#161)

[33mcommit 4b54a502bc6a448be0d08c754f17099f6872549b[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Jul 7 18:14:58 2023 +0200

    Add privacy policy (#159)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit dc49c0cc49d542ab0729715ddde8be24cf1bf1aa[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jul 7 18:06:09 2023 +0200

    Update footer (#158)

[33mcommit e63fcfcb767340c12e3b3df9acf7941e124ed3f8[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 7 17:55:29 2023 +0200

    [DEV-713] - Fix copy app IO index guides (#157)

[33mcommit b58bf8a01ed6f76364ed2bd177a5266d23be8276[m
Author: Jessica Corrias <corrias.jessica93@gmail.com>
Date:   Fri Jul 7 17:38:02 2023 +0200

    Add 404 page (#151)

[33mcommit e7acde650e2ec7c65ab48d967306923155ab35a7[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 7 17:28:27 2023 +0200

    Fix homepage contents (#147)

[33mcommit 33d6abfcf2eb2fd27b75c55721dc2bc37f7cf318[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Jul 7 17:07:24 2023 +0200

    [DEV-733] - Fix product header and fix and hide breadcrumbs  (#154)

[33mcommit cffd72c3eb4fc579c9962ef67f649df6d4b623c1[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 7 16:59:54 2023 +0200

    [DEV-720, DEV-722] - Fix some contents of IO-sign overview page and appIO (#135)

[33mcommit 7b7b88214d5798a50e165fdece403f00cde57d6c[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 7 16:46:41 2023 +0200

    Fix some contents of app IO overview page (#136)

[33mcommit 517193c1d73e42d167c142cf427cc50b31b827e1[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jul 7 16:20:51 2023 +0200

    [DEV-728] - Fix some contents of pagoPA overview page (#137)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit c38b445edf51d38099f5566ba21b052967beb7d2[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jul 7 16:13:05 2023 +0200

    [DEV-727] Update send contents (#156)

[33mcommit 179d5e05bf9c3cc1bb7161c13b8bc61edde66513[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Jul 7 16:00:48 2023 +0200

    Set image rounded corner in newsroom items component (#155)

[33mcommit 6400a123d62932ce3131334fdb6b2472ceed9dad[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Jul 7 14:25:28 2023 +0200

    Fix guide cards text margin, padding and list line-height (#152)

[33mcommit d24979c601a68286a159bb2bab19f5ae011e9cde[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Jul 7 14:21:51 2023 +0200

    fix start info cta (#153)

[33mcommit d304ced8fa97f696214a89dbf2310ac05847984a[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Jul 7 11:15:32 2023 +0200

    [DEV-422] - Add tutorial list page layout (#146)

[33mcommit 98fd3f378a0213de7b38d74ff82bf77c0047b582[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Fri Jul 7 11:09:04 2023 +0200

    Add guide version dropbox (#149)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit edf52a9f7116d94ab050d502e11a609f2671fd36[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Jul 7 10:09:27 2023 +0200

    Fix start info (#143)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit f63ddec30da8d7db0f0c0d02a048c5e58866fd1e[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Jul 7 10:01:18 2023 +0200

    refactor feature component and overview content (#145)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit b80d414ac1c70294f055201163e93acd3821152c[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jul 7 09:38:27 2023 +0200

    Manage not closed file tags of docs (#150)
    
    * Manage missing-closing file tag
    
    Before this commit a missing closing tag had all the elements after it
    as children. After this commit a not self-closed tag file is managed as
    a self-closed one.
    
    * Update comment

[33mcommit 31b3f897ae88de302e0f412836431370aff05ea5[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Jul 7 09:15:08 2023 +0200

    Refactor post integration (#148)

[33mcommit b040332fce0e965fe06dc5239a282ec6f8ed7de3[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jul 6 18:46:28 2023 +0200

    Fix newsroom component (#139)

[33mcommit 29622e5e184ec9f47975aa9615b2cd7a2e10ddba[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jul 6 18:07:02 2023 +0200

    Improve cloudfront function (#144)

[33mcommit d104f82bfd2d072d9a08be60f47f8ff4c257ca92[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jul 6 17:01:11 2023 +0200

    Refactor listing components (#140)

[33mcommit a04d32090ce7252cd81bbd48ae2bb055b1f50ccb[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jul 6 16:42:52 2023 +0200

    Add environment to export step (#142)

[33mcommit 25c9c2d4962add5dabb5489db4a483d3742f26a9[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jul 6 16:18:35 2023 +0200

    Refactor overview content translation (#138)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 999d1836c56d7289e7134742e5f1a9330392f74f[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jul 6 16:13:12 2023 +0200

    Add all tutorials and guides (#132)
    
    Co-authored-by: Marco Bottaro <marco.bottaro@uqido.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 78dcd59321cfec4df8ca4236120c073c635e15bd[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jul 6 12:51:42 2023 +0200

    [DEV-697] - Add hero slider to Homepage (#133)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 315ba10318eb2f5dc02ca0ba0ffacbd552c73e3b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jul 6 09:28:51 2023 +0200

    Fix CSP for pagoPA API (#134)

[33mcommit 786a6138d7ba054e5be640af035a95f9e7b7e634[m
Author: Jessica Corrias <corrias.jessica93@gmail.com>
Date:   Thu Jul 6 08:55:19 2023 +0200

    [DEV-606]: pagoPA API (#128)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 498ce2aaa56c29552e596fb6322dad80571c70fd[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 5 17:27:00 2023 +0200

    [DEV-637] - Add SEND overview (#125)

[33mcommit 46323361418131807c964cb8ea72e102d35f1463[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 5 17:20:40 2023 +0200

    [DEV-636] - Add pagoPA overview (#127)

[33mcommit dd3cbfe36e746a2616cf9e3b836f1229c9446591[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 5 16:26:18 2023 +0200

    Add github URL to img-src CSP (#126)

[33mcommit dc59e19c04085f92f7da00e20917b4b85744d51e[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 5 15:34:55 2023 +0200

    [DEV-610] - Add IO-Sign Overview (#123)

[33mcommit 846f730fa16be3f2f96d0cc6e0e99dda915c5704[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jul 5 15:12:10 2023 +0200

    Update action.yaml (#124)
    
    Add missing shell to deploy action

[33mcommit c1c50479e883b0a58ca0c5f64e16101b7218806f[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jul 5 14:53:21 2023 +0200

    Add gitbook-docs and download script (#122)

[33mcommit 8939476395c5e92170ab6cb4ca2ccc8a41054daf[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 5 12:50:00 2023 +0200

    [DEV-699] - Add App IO guide index page (#121)

[33mcommit 6a908118cfa69452638c18a5c05ca8b9551b11a7[m
Author: Jessica Corrias <corrias.jessica93@gmail.com>
Date:   Wed Jul 5 12:05:02 2023 +0200

    Feature/send api (#120)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit abddda776875d2302b33516460a3cb2b67797c86[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed Jul 5 11:51:39 2023 +0200

    [DEV-711] - Feature homepage/add news section (#117)

[33mcommit a070e4830cc7d425fde1ae1af7e5cfebb181c366[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed Jul 5 11:40:41 2023 +0200

    Add related links to homepage (#116)

[33mcommit 90ec041870832db2131fa76fb2310e6cb1595cbd[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed Jul 5 11:34:18 2023 +0200

    [DEV-673] - Add breadcrumb (#114)

[33mcommit f9097f7ca2a0d0a5ef722bfe38af9a037a59d8fc[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 5 11:00:34 2023 +0200

    Rename Piattaforma Notifiche product (#118)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 056abf4db2d50f28ac5a0a5f4ed2dc71a824efde[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jul 5 10:54:01 2023 +0200

    Fix order of App IO subpaths (#119)

[33mcommit c32c78a8bf9c8bc239ffd4ba03a7d98dbcc82586[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed Jul 5 10:05:33 2023 +0200

    [DEV-698] - homepage/product showcase (#115)

[33mcommit 73f1439373e39198055c732cc332a0006f3fa160[m
Author: Jessica Corrias <corrias.jessica93@gmail.com>
Date:   Tue Jul 4 15:07:42 2023 +0200

    [DEV-611]: add API page in "Firma con IO" (#113)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 0ce074c5e5c2ea5ffc680aa3b0d13ed18c8d4b70[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Jul 4 14:16:46 2023 +0200

    Add https://io.italia.it/assets/ to img-src in CSP (#112)

[33mcommit f5ec81cfecc7aecc638cfe6c12ef4983168fc9ba[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Tue Jul 4 14:10:03 2023 +0200

    [DEV-460] - app IO overview page (#107)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 2c3a5e1450c93062da4cce29f880082fccf0629d[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Jul 4 12:57:36 2023 +0200

    Add https://raw.githubusercontent.com/pagopa/ to security policy (#110)

[33mcommit f823065828a84b54db65afa53e808d3801f40733[m
Author: Jessica Corrias <corrias.jessica93@gmail.com>
Date:   Tue Jul 4 11:39:18 2023 +0200

    [DEV-425] - API in app IO (#81)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 53c0f0f0fa555e64715d0b257574cf502075a0f4[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Tue Jul 4 10:23:18 2023 +0200

    [DEV-605, DEV-607, DEV-267] - Add guides lists (#93)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 4a59416f61f737482bc4ef45a0bfe19a689bcc71[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 3 17:02:18 2023 +0200

    Remove babel config file and improve test configuration (#109)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 60a8237d425e9c4823957dd3ce3963d115924240[m
Author: Jessica Corrias <corrias.jessica93@gmail.com>
Date:   Mon Jul 3 13:02:16 2023 +0200

    Add banner links (#103)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit d5cb79f5b1a70ceacf979c2dfa82850f3259c752[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Jul 3 10:17:12 2023 +0200

    Update github OIDC thumbprint (#105)

[33mcommit 79f5c2687af937d0bfc8011ba500cda8d24a7199[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 3 09:26:48 2023 +0200

    Create workflow to auto assign PR (#102)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 0c425c2d66e440dc6f3cc3596689ded9de8cb867[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 3 09:19:21 2023 +0200

    Add stale workflow (#89)

[33mcommit c685923abbf84bc548b0c31a2a4d0ebfe0b146fa[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Jul 3 09:14:46 2023 +0200

    Add step which adds size label to PR (#94)

[33mcommit 17c391e5a77220ddd4930e415b53149d094da6d9[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jun 30 17:07:19 2023 +0200

    Fix instagram link (#104)

[33mcommit 6f0f41c36ed467daff67caa92c20913cbdcd3fca[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Fri Jun 30 14:58:41 2023 +0200

    [DEV-675] - Add footer (#91)

[33mcommit 227698ee8c7299df2600af0d4bf5fb10fa3b099c[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jun 29 18:40:29 2023 +0200

    [DEV-688] - Add site header (#84)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 2ba5a555ca5bd17450cfdbf65a50f504630e97c9[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Thu Jun 29 17:17:58 2023 +0200

    [DEV-671] - Add product header (#82)
    
    Co-authored-by: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit cda55430675b8ee56f67072731a131aa1f849b48[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jun 29 14:33:50 2023 +0200

    Automatically add labels to PR (#90)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit dc2ef9d70349733138fe40e977ec896299e8012c[m
Author: Marco Ponchia <ponchia.marco1994@gmail.com>
Date:   Wed Jun 28 17:14:14 2023 +0200

    Update @pagopa/pagopa-editorial-components version and next conifg (#88)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 2f875ea73b3f8af359a13ca592749d1d48d1ed8f[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jun 28 16:24:53 2023 +0200

    Set lock file version (#87)

[33mcommit 2afbbf4a550e2ed7c2c13a14bbe6c398d634e03e[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jun 28 11:27:01 2023 +0200

    [DEV-689] - Add the step that build the static site (#85)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 7f4871f25a7a639a4665a58422f57dd2bd17e4e3[m
Author: marcobottaro <39835990+marcobottaro@users.noreply.github.com>
Date:   Wed Jun 28 09:29:24 2023 +0200

    [DEV-676] - New instance of next.js (#79)
    
    Co-authored-by: Marco Ponchia <marco.ponchia@uqido.com>

[33mcommit 649408a2ab707153a733da5e05a5b81eee0f5ce2[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Jun 27 12:06:22 2023 +0200

    Verify package lock is up to date (#83)

[33mcommit aa21bd6e2079e068b46758b8590ef063b16e4409[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jun 21 13:03:07 2023 +0200

    [DEV-678] - Automatic deploy on DEV environment (#78)

[33mcommit 763731c5eba3006065bba840ac1c762681ee2194[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jun 16 16:35:17 2023 +0200

    [DEV-379] - DNS aliases (#77)

[33mcommit 69eeabf54f13e15829c9ddfdac2bdefd17089f82[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Jun 16 09:46:05 2023 +0200

    Link CDN to custom domain (#76)

[33mcommit 720da08f0ae63ee5d4e921a382cee6faca36a966[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jun 15 18:05:26 2023 +0200

    Add dns delegate records (#75)

[33mcommit da568a377f91c67ed932a1bd96cf45681895a369[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jun 15 12:29:02 2023 +0200

    [DEV-653] - Link tls certificate to CDN (#74)
    
    * Add DNS for dev environment
    
    * Add new variables
    
    * Update CDN config using DNS
    
    * Create ACM certificate
    
    * Revert "Create ACM certificate"
    
    This reverts commit 4a12a33f833380606baa8c419c265a7bc2cb37d4.
    
    * Revert "Update CDN config using DNS"
    
    This reverts commit 5eec4fb60e4e80734b5316e592bca7058245431e.
    
    * Create prod env
    
    * Create DNS module
    
    * Add reference to dns module
    
    * Add output for dns records
    
    * Remove dns module
    
    * Fix output
    
    * Add DNS zone
    
    * Fix description
    
    * Remove unused variable
    
    * Convert DNS name to string
    
    * Remove comment
    
    * Fix prod domain
    
    * Remove blank line
    
    * Add us-east provider
    
    * Create TLS certificate
    
    * Add alternative names using www
    
    * Add TLS certificate validation
    
    * Fix formatting
    
    * Add enable_cdn_https variable
    
    * Update CDN configuration
    
    * Change variable name and improve description

[33mcommit ad2b53d440858afe97680f50675b09d0d0e3d92a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jun 15 12:10:52 2023 +0200

    [DEV-650] - Add TLS certificates and validation (#72)

[33mcommit a23e772a28d97fcdcd52ecf46b4c63f215f64498[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Jun 13 17:27:40 2023 +0200

    Init prod environment resources (#73)

[33mcommit d4eeaf33a96d9a4b96ee4390bce724e78f7dc9e4[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Jun 13 10:38:34 2023 +0200

    [DEV-649] - Create DNS zone (#71)

[33mcommit 165359edbb3be30467d7c111258d0321637b0705[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Jun 9 17:05:45 2023 +0200

    DEV-600 Add CloudFront function (#70)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit fa3df60d06c272243ec6892cf646ab8e633dcb35[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jun 8 15:50:37 2023 +0200

    [DEV-599] - Deploy workflow (#64)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 17f672a5e366f4a9403a04069046ffe14057e7dd[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Jun 7 12:38:13 2023 +0200

    Remove redundant infrastructure tags (#66)

[33mcommit 4414ebf77e112270921d3724e7f16a433baa7c5a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Jun 7 11:18:22 2023 +0200

    Remove guides to sync array (#67)

[33mcommit 5abfd6aaad273a96420b7434577101c199969522[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jun 1 18:02:22 2023 +0200

    Fix "infra deploy" workflow (#63)

[33mcommit 7f647307ac75e8dbf93631cbb7ca9073b4a5ef19[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Jun 1 15:54:41 2023 +0200

    DEV-548 Add Infra CI and manual CD (#60)

[33mcommit 66fd73cc8e711159400edf2eed5ec97aa6ea2ce7[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Jun 1 12:05:50 2023 +0200

    [DEV-546] - Enforce ESLint rules for functional programming (#59)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 622293a87f03992ad956cf1be8671e801563f039[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue May 23 14:46:54 2023 +0200

    Update static contents (#56)

[33mcommit 2aaf7f03b24af5ec19134310f494265906ef7aea[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue May 23 14:32:43 2023 +0200

    Add compile dependency to dev task (#58)
    
    When we start the applications using `npm run dev` command, the system doesn't
    compile the source code automatically. In this way, we are using old compiled
    source or we try to start the app without compiled sources. After this commit,
    every time we run the `npm run dev` command, we first compile sources

[33mcommit c72bc68c2bcdf43be58bf8fb702b3767a203c777[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue May 23 11:20:39 2023 +0200

    Prevent image overflow on guide preview (#57)

[33mcommit ba91376e1e3ef96f177545af0c9ad9d0126ca03e[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon May 22 09:28:36 2023 +0200

    Remove @pagopa/mui-italia dependency from storybook-playground app (#55)

[33mcommit 1793cbab57fb5bad86d3de09aaf963e9063b0734[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue May 16 15:44:34 2023 +0200

    DEV-434 Refactor repository migrating to multipackage structure (#53)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit b8c93a30a33b9cebde18b125cfbdc8a4fe6c65e7[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon May 15 14:47:46 2023 +0200

    [DEV-428] - Render Guide index Page (#52)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit f9d5c7c9ed9ae9c96b6bb93ab4567d0639007256[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue May 9 11:44:12 2023 +0200

    Add capabilities and standardise the codebase (#51)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 8a223364ab03c7e6a0f6177f7f43fd4a6da9c0ab[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon May 8 10:32:51 2023 +0200

    DEV-483 Fix the path of guides versions (#50)

[33mcommit 7d6c2b916285ad9d479f3fcd9aa2337ea763f603[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu May 4 15:30:56 2023 +0200

    DEV-481 Add breadcrumb to product guide pages (#49)

[33mcommit 1f2d5831f557ddb84cc98afa59923ce60a6da769[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu May 4 12:16:32 2023 +0200

    DEV-391 Add versions menu (#48)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit b5ce14798f70e6f437a1c034234631efe3451d17[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu May 4 10:43:43 2023 +0200

    DEV-390 Render product guide menu (#47)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit a97f2b9b59bde46ff3a19e645a38e13f07c13917[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed May 3 11:34:15 2023 +0200

    DEV-430 Add GitBook layer to fetch guides pages (#46)

[33mcommit c0215e3a4197aa98dc43c84f559d74e0df24ff26[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Apr 20 09:57:15 2023 +0200

    DEV-392 Render a subset of GitBook markdown (#45)

[33mcommit 1bbadd02da97dbf0ca9ec1aba6a0ec0bab0c1e9d[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Apr 18 09:30:47 2023 +0200

    [DEV-389] - Add storybook (#43)

[33mcommit 9dd7a2b3153bebe11d3d1b8c8b9ea9cecd1a161c[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Apr 12 15:59:49 2023 +0200

    DEV-401 Add guide page structure (#42)

[33mcommit bbdcceaed9f00b57474535c05347c44294ce4465[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Apr 12 09:53:23 2023 +0200

    Refactor to get dynamic routing (#41)

[33mcommit f6bcacdb6a476bdf37869a09a6b51b1479d14fe6[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Apr 5 09:18:53 2023 +0200

    [DEV-388] - Add @gitbook/api library and create GitBook client (#40)

[33mcommit 2c465c237e6e213b35ce700bc6ff73386fc62d04[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Apr 4 12:26:03 2023 +0200

    Update node version (#39)

[33mcommit 98d3c407688f73753f0adc19078fb7762c82a192[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Mar 31 13:00:01 2023 +0200

    Add CODEOWNERS file (#38)

[33mcommit 344d68c02046a5ae43cb5a6da1efeab1f3b69ec4[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Mar 31 12:57:51 2023 +0200

    [DEV-365] - Create CI workflow (#37)

[33mcommit 806e758125aff52474f3c16400ba615669cbfc17[m
Author: AF <alessandro.ferlin@pagopa.it>
Date:   Fri Mar 31 12:50:26 2023 +0200

    Format the code

[33mcommit 6b1d3cfc70e9f5fc511bbf54d07b064ebcd2aa8f[m
Author: AF <alessandro.ferlin@pagopa.it>
Date:   Fri Mar 31 12:46:18 2023 +0200

    Rename Quick Start to Guida Rapida

[33mcommit 90659e3ac9f4a564aa81c103bdbd46bf31050c97[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 30 18:02:26 2023 +0200

    Add basePath to image src (#36)

[33mcommit 9fb84e430ce1dcd679db21bc3c46ca3fa19de356[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Mar 30 09:52:45 2023 +0200

    DEV-359 Add a new tutorial (#35)

[33mcommit 0c8ac89cba7e965c0047bdd24f24dc1c8d21eb3f[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Mar 29 09:25:08 2023 +0200

    DEV-353 Improve header style (#31)
    
    Co-authored-by: Carlo Alberto Degli Atti <lordkada@users.noreply.github.com>

[33mcommit 0e56ce95c5aabce2471ed73610803239041efd45[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Tue Mar 28 15:44:47 2023 +0200

    DEV-358 Add tutorial index page (#32)

[33mcommit 3129031b9b4391f21134c858a2aab2c6932e3b91[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Mon Mar 27 10:27:07 2023 +0200

    Add post review suggestions (#29)

[33mcommit 9202dbe70a7e1bbe19e90aa30db52955cc7c9084[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Mar 24 11:07:52 2023 +0100

    [DEV-356] - GitHub action to deploy Dev Portal (#27)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit 51571dcc2f42234d46db4df5b128cd04cbb8f6b8[m
Author: Fabrizio Ulisse <fabrizio.ulisse@gmail.com>
Date:   Fri Mar 24 10:47:47 2023 +0100

    Revision quickstart text (#26)

[33mcommit c047ccc0ec20acbb88023b569ddb6c118fe5ed3a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 23 17:45:33 2023 +0100

    Fix clickable area (#30)

[33mcommit 1f5a1eda77da7f168ac4a7e532f3bd34d67e7f4c[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 23 15:19:45 2023 +0100

    Use Next Link (#28)

[33mcommit c41d8f8f78a86723c7a72caa79b5f6985fbbee09[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 23 12:27:49 2023 +0100

    [DEV-355] - Add robots file (#25)

[33mcommit 6d30f93e98e82cfda72983a91a9ea9d834700493[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 23 11:33:54 2023 +0100

    Cleanup dependencies and remove legacy files (#24)

[33mcommit 0c3fa4b8c045d4f54452ae5d3b599e23a2f58afe[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Mar 23 11:23:16 2023 +0100

    [DEV-349] - Add Quickstart page (#23)

[33mcommit a3946c1a9f1f498d8df1dae62ddd762a4aef81ad[m
Author: Fabrizio Ulisse <fabrizio.ulisse@gmail.com>
Date:   Wed Mar 22 15:28:56 2023 +0100

    DEV-320 Fill hompage and overview text (#22)

[33mcommit 01af67cd673c7a81b0ec7ad148d8bcb68c782647[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Fri Mar 17 16:18:18 2023 +0100

    DEV-278 Add panoramica page (#21)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit d455347d9aa93851bb25eb75e844fd3d95b6f3d6[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Mar 17 12:42:25 2023 +0100

    [DEV-260] - Create static homepage (#20)

[33mcommit e2dd4b565333179c4b4aa6763551969d84eb0be0[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Fri Mar 10 11:54:51 2023 +0100

    [DEV-332] - Quickstart component (#17)

[33mcommit 26c3853a2ef7fb5df0a49e0c2cd0baf01641aa52[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Mar 9 10:53:37 2023 +0100

    [DEV-330] - Hero Space component (#16)

[33mcommit 234b3a57c96088144f92c29ad6c16ed5a1ad4fef[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Thu Mar 9 10:05:56 2023 +0100

    DEV-326 Add product menu (#15)
    
    Co-authored-by: Marco Comi <9998393+kin0992@users.noreply.github.com>

[33mcommit 792c115a639bb8a2f29c0e61bb22c8fc960d4515[m
Author: AF <4775679+datalek@users.noreply.github.com>
Date:   Wed Mar 8 10:16:57 2023 +0100

    Add Header component (#14)

[33mcommit 273c91971b11c0b29c553551a617888ffa6b9e1a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Mar 8 09:53:27 2023 +0100

    [DEV-327] - Footer component (#13)

[33mcommit 909c530479aff8ca38243f0149a04ccbe6f003fb[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Mar 6 11:29:10 2023 +0100

    Improve instructions required to start the dev portal locally (#12)

[33mcommit f16b4de13207f813101b833244831f970fbe815e[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Feb 27 14:26:02 2023 +0100

    [DEV-203] - Safely consume GitBook API (#10)

[33mcommit 0199f339d19853039c8305c8345d96fcfa4c623b[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Mon Feb 13 11:21:06 2023 +0100

    [DEV-134] - Init NextJS Project (#7)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit aef14a90c667dbfc0652774f8eb7137dd3ab0264[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Thu Feb 9 12:02:16 2023 +0100

    Add prettier (#6)

[33mcommit 1ee3591fcdfc17660ce8ea06aa83775fcaf95410[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Wed Feb 8 15:25:55 2023 +0100

    ADR 0002 improvements (#5)
    
    Co-authored-by: AF <4775679+datalek@users.noreply.github.com>

[33mcommit c43d56fee986301d22276a8d7d9449554f7a0dbf[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 7 14:47:37 2023 +0100

    Add ADR to decide what features use of NextJS (#3)

[33mcommit 17f3d9280e3c83f85742d14bc9862085acf0edd9[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 7 09:50:01 2023 +0100

    Add PR template (#2)

[33mcommit ade9dbdca2d1e423c9b48df7b28354bc124da342[m
Merge: 7b584be f719d89
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 7 09:48:17 2023 +0100

    Merge pull request #1 from pagopa/adr-directory

[33mcommit f719d899373da1164d20262f1beb8ce29c5ed72a[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 7 09:36:02 2023 +0100

    Add first adr

[33mcommit 516cbcf7bd13745ae4baf558078742b169f7e45e[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 7 09:35:15 2023 +0100

    Add adr template

[33mcommit 656775d8202b36aa780f68b2347df23fb33860f6[m
Author: Marco Comi <9998393+kin0992@users.noreply.github.com>
Date:   Tue Feb 7 09:32:51 2023 +0100

    Define adr directory

[33mcommit 7b584be148aaf5d494d6618f245e8a6af62a6176[m
Author: AF <alessandro.ferlin@pagopa.it>
Date:   Thu Jan 12 12:57:05 2023 +0100

    Fix typo

[33mcommit 1b1a7cd87322b31a68b4d0a7610c714f35bfb190[m
Author: AF <alessandro.ferlin@pagopa.it>
Date:   Thu Jan 12 12:55:47 2023 +0100

    First commit
