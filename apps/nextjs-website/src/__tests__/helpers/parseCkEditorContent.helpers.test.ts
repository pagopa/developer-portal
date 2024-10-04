import { parseCkEditorContent } from '@/helpers/parseCkEditorContent.helpers';

describe('parseCkEditorContent', () => {
  it('should correctly parse content and generate menu items', () => {
    const content = `<h1>titolo h1</h1><h2>Éxámplé String!@#!@#$%^&amp;*()_+</h2><h3>titolo h3</h3><h4>titolo h4</h4><p><strong>titolo h5</strong></p><p><i>titolo h6</i></p><h2>Un esempio: la TARI</h2><p>Nella tabella che segue trovi un esempio sbagliato, con un numero inutilmente elevato di servizi relativi alla TARI:</p><figure class="table"><table><thead><tr><th><strong>SERVIZIO</strong></th><th><strong>MESSAGGIO</strong></th></tr></thead><tbody><tr><td>❌ TRIBUTI - TARI - Notifica sollecito</td><td>Notifica sollecito TARI</td></tr><tr><td>❌ TRIBUTI - TARI - Notifica provvedimento ordinario</td><td>Notifica provvedimento ordinario TARI</td></tr><tr><td>❌ TRIBUTI - TARI - Notifica provvedimento sanzionatorio</td><td>Notifica provvedimento sanzionatorio TARI</td></tr></tbody></table></figure><p>In realtà, <strong>l’unico servizio è la TARI</strong>, e <strong>da questo unico servizio dovrai inviare tutti i messaggi relativi al suo ciclo di vita</strong>, come ad esempio:</p><ul><li>inviare un messaggio informativo che ricorda ai destinatari che è il momento di fare la dichiarazione di occupazione, nel caso in cui debbano farla;</li><li>inviare uno o più messaggi sullo stato della richiesta di occupazione;<ul><li>inviare un messaggio con l'avviso di pagamento;</li></ul></li><li>inviare promemoria in prossimità della scadenza di un pagamento. daFAFDV</li></ul><blockquote><p>quote dei quote</p></blockquote>`;

    const result = parseCkEditorContent(content);

    // Test the parsedContent
    expect(result.parsedContent).toContain('titolo h1'); // Check if a h1 heading is present
    expect(result.parsedContent).toContain('Éxámplé String!@#!@#$%^&amp;*()_+'); // Check if a h2 heading is present
    expect(result.parsedContent).toContain(
      `id="ckeditor-example-string!!$%^&amp;*()_"`
    ); // Check if IDs are added correctly around a h2 heading
    expect(result.parsedContent).toContain(
      `<div class="menuAnchor" id="ckeditor-example-string!!$%^&amp;*()_"><h2>Éxámplé String!@#!@#$%^&amp;*()_+</h2></div>`
    ); // Check if IDs are added correctly around a h2 heading

    // Test the menuItems array
    expect(result.menuItems).toEqual([
      {
        title: 'Éxámplé String!@#!@#$%^&*()_+',
        href: '#ckeditor-example-string!!$%^&*()_',
        level: 2,
      },
      { title: 'titolo h3', href: '#ckeditor-titolo-h3', level: 3 },
      {
        title: 'Un esempio: la TARI',
        href: '#ckeditor-un-esempio:-la-tari',
        level: 2,
      },
    ]);
  });

  it('should return an empty menuItems array if there are no headings', () => {
    const content = `<p>Some content without headings</p>`;

    const result = parseCkEditorContent(content);

    expect(result.parsedContent).toContain(
      '<p>Some content without headings</p>'
    );
    expect(result.menuItems).toEqual([]); // Expecting no menu items
  });
});
